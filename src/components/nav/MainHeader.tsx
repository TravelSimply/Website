import { AppBar, Avatar, Container, Grid, IconButton, Toolbar, Typography, Menu, MenuItem,
    ListItemText, ListItemIcon, Divider, useTheme, useMediaQuery, Breakpoint, Drawer, List, ListItemButton, ListItem, Badge, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import React, {useState, MouseEvent, useMemo} from 'react'
import { ClientPopulatedUserNotifications, ClientUser } from '../../database/interfaces'
import { PrimaryLink } from '../misc/links';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {darkPrimaryOnHover, primaryLightBgOnHover} from '../misc/animations'
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BackpackIcon from '@mui/icons-material/Backpack';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { signOut } from '../../utils/auth';
import MenuIcon from '@mui/icons-material/Menu';
import { OrangePrimaryIconButton } from '../mui-customizations/buttons';
import { UserNotifications } from '../hooks/userNotifications';
import CircleIcon from '@mui/icons-material/Circle';
import Notifications from './Notifications';

export interface DrawerItem {
    href: string;
    as?: string;
    name: string;
    selected: boolean;
}

interface Props {
    user: ClientUser;
    notifications: UserNotifications;
    drawer?: {items: DrawerItem[]; breakpoint: Breakpoint;};
}

export default function MainHeader({user, notifications, drawer}:Props) {

    if (!user) {
        return (
            <div>app bar for people not signed in</div>
        )
    }

    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up('sm'))

    const displayDrawer = useMediaQuery(theme.breakpoints.down(drawer?.breakpoint || 'xs'))

    const [openDrawer, setOpenDrawer] = useState(false)

    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null)

    const openProfileMenu = (e:MouseEvent<HTMLElement>) => {
        setProfileAnchor(e.currentTarget)
    }

    const closeProfileMenu = () => {
        setProfileAnchor(null)
    }


    return (
        <AppBar position="sticky" sx={{backgroundColor: "orangeBg.light"}}>
            <Box mx={1}>
                <Box my={1}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container>
                                {drawer && displayDrawer && <Grid item>
                                    <OrangePrimaryIconButton onClick={() => setOpenDrawer(true)}>
                                        <MenuIcon />     
                                    </OrangePrimaryIconButton> 
                                </Grid>}
                                <Grid item>
                                    <PrimaryLink href="/" variant="h4">
                                        {smUp ? 'Travel Simply' : 'TS'}
                                    </PrimaryLink>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={2} alignItems="center" wrap="nowrap">
                                <Grid item>
                                    <Notifications notifications={notifications} />
                                </Grid>
                                <Grid item container alignItems="center" spacing={0} sx={{
                                    ...darkPrimaryOnHover
                                }} onClick={(e) => openProfileMenu(e)}>
                                    <Grid item>
                                        <Avatar src={user.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                    </Grid>
                                    {smUp && <>
                                        <Grid item sx={{paddingLeft: 1}}>
                                            <Typography variant="body1">
                                                {user.data.username?.substring(0, user.data.username.length < 15 ? undefined : 15)}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <ArrowDropDownIcon sx={{marginTop: .5}} />
                                        </Grid>
                                    </>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Menu anchorEl={profileAnchor} anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    transformOrigin={{vertical: 'top', horizontal: 'right'}} open={Boolean(profileAnchor)}
                    onClose={() => closeProfileMenu()} sx={{mt: 5.22}} PaperProps={{sx: {backgroundColor: "orangeBg.light"}}}>
                        <Link href="/profile">
                            <a>
                                <MenuItem sx={{...darkPrimaryOnHover}}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Profile
                                    </ListItemText>
                                </MenuItem>
                            </a>
                        </Link>
                        <Link href="/profile/friends">
                            <a>
                                <MenuItem sx={{...darkPrimaryOnHover}}>
                                    <ListItemIcon>
                                        <PeopleIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Friends 
                                    </ListItemText>
                                </MenuItem>
                            </a>
                        </Link>
                        <MenuItem sx={{...darkPrimaryOnHover}} onClick={() => signOut()}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Sign Out
                            </ListItemText>
                        </MenuItem>
                        <Divider />
                        <Link href="/travel-groups">
                            <a>
                                <MenuItem sx={{...darkPrimaryOnHover}}>
                                    <ListItemIcon>
                                        <BackpackIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        My Travel Groups
                                    </ListItemText>
                                </MenuItem>
                            </a>
                        </Link>
                    </Menu>
                </Box>
            </Box>
            {drawer && displayDrawer && <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)} >
                <Box height="100%" bgcolor="orangeBg.light" minWidth={200}>
                    <List>
                        {drawer.items.map((item, i) => (
                            <Link key={i} href={item.href} as={item.as}>
                                <a>
                                    <ListItemButton sx={{backgroundColor: item.selected ? 'primary.light' : undefined, 
                                        color: item.selected ? '#fff' : undefined,
                                        ...primaryLightBgOnHover}}>
                                        <ListItemText>
                                            <Typography variant="body1" sx={{mr: 1}} >
                                                {item.name}
                                            </Typography>
                                        </ListItemText>
                                    </ListItemButton>
                                </a>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Drawer>}
        </AppBar>
    )
}