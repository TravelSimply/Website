import { Badge, Box, IconButton, Menu, List, ListItem, CircularProgress, ListItemIcon, ListItemText, Divider, Grid, Typography, Icon } from '@mui/material';
import React, {useState, useMemo, MouseEvent} from 'react'
import { UserNotifications } from "../hooks/userNotifications";
import { darkPrimaryOnHover } from '../misc/animations';
import CircleIcon from '@mui/icons-material/Circle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Link from 'next/link'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BackpackIcon from '@mui/icons-material/Backpack';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { findSentDiff } from '../../utils/dates';

interface Props {
    notifications: UserNotifications;
}

interface INotContent {
    href: string;
    as?: string;
    icon: React.ReactChild;
    msg: string;
    time: string;
}

export default function Notifications({notifications}:Props) {

    const [notificationsAnchor, setNotificationsAnchor] = useState<HTMLElement>(null)
    const [newNotifications, setNewNotifications] = useState(false)
    const [notContent, setNotContent] = useState<INotContent[]>(null)

    useMemo(() => {

        if (!notifications?.filtered) return

        setNewNotifications(Boolean(notifications.filtered.find(n => n.new)))
        setNotContent(notifications.filtered.map(not => {
            if (not.type === 'travelGroup') {
                return {
                    href: '/travel-groups/[id]/activity',
                    as: `/travel-groups/${not.data[0]}/activity`,
                    icon: <BackpackIcon color="primary" fontSize="large" />,
                    msg: `New Activity in ${not.data[2]}`,
                    time: findSentDiff(not.time) + ' ago'
                }
            } else if (not.data.collection === 'travelGroupInvitations' && not.data.content.travelGroupName.length > 0) {
                return {
                    href: '/travel-groups/invitations',
                    icon: <GroupAddIcon color="primary" fontSize="large" />,
                    msg: `You\'ve been invited to join ${not.data.content.travelGroupName[0]}`,
                    time: findSentDiff(not.time) + ' ago'
                }
            } else {
                return null
            }
        }).filter(a => a))
    }, [notifications])

    const markNewNotificationsAsSeen = async () => {

        const noContentBasic = notifications.raw.notifications.data.basic.map(n => ({
            seen: n.seen, id: n.id, time: n.time, collection: n.collection
        }))

        try {

            await axios({
                method: 'POST',
                url: '/api/users/notifications/all-seen',
                data: {
                    id: notifications.raw.notifications.ref['@ref'].id,
                    basic: noContentBasic,
                    travelGroups: notifications.raw.notifications.data.travelGroups
                }
            })

        } catch (e) {}
    }

    const openNotificationsMenu = (e:MouseEvent<HTMLElement>) => {
        if (newNotifications) {
            markNewNotificationsAsSeen()
            setNewNotifications(false)
        }
        setNotificationsAnchor(e.currentTarget)
    }

    const closeNotificationsMenu = () => {
        setNotificationsAnchor(null)
    }

    return (
        <Box>
            <IconButton sx={{...darkPrimaryOnHover}}
            onClick={(e) => openNotificationsMenu(e)}>
                {newNotifications ? <Badge overlap="circular" 
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={
                    <CircleIcon sx={{fontSize: 16}} color="primary" />
                }>
                    <NotificationsIcon />
                </Badge> :
                <NotificationsIcon /> 
            }
            </IconButton>
            <Menu anchorEl={notificationsAnchor} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={Boolean(notificationsAnchor)} sx={{mt: 1.1}}
            onClose={() => closeNotificationsMenu()} PaperProps={{sx: {backgroundColor: "orangeBg.light"}}}>
                <Box width="min(80vw, 400px)" maxHeight={600}>
                    <List>
                        {notContent?.map((not, i) => (
                            <Link key={i} href={not.href} as={not.as}>
                                <a>
                                    <Box px={2} py={1} sx={{...darkPrimaryOnHover}}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box pt={0.3}>
                                                    {not.icon}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography variant="body1">
                                                    {not.msg}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <BackpackIcon sx={{opacity: 0}} fontSize="large" />
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {not.time}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </a> 
                            </Link>
                        )) || <CircularProgress />}
                    </List>
                </Box>
            </Menu>
        </Box>
    )
}