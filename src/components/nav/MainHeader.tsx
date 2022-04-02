import { AppBar, Avatar, Container, Grid, IconButton, Toolbar, Typography, Menu, MenuItem,
    ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import React, {useState, MouseEvent} from 'react'
import { ClientUser } from '../../database/interfaces'
import { PrimaryLink } from '../misc/links';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {darkPrimaryOnHover} from '../misc/animations'
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BackpackIcon from '@mui/icons-material/Backpack';
import { signOut } from '../../utils/auth';

interface Props {
    user: ClientUser;
}

export default function MainHeader({user}:Props) {

    if (!user) {
        return (
            <div>app bar for people not signed in</div>
        )
    }

    const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null)

    const openProfileMenu = (e:MouseEvent<HTMLElement>) => {
        setProfileAnchor(e.currentTarget)
    }

    const closeProfileMenu = () => {
        setProfileAnchor(null)
    }

    return (
        <AppBar position="sticky" sx={{backgroundColor: "orangeBg.light"}}>
            <Container maxWidth="xl">
                <Box my={1}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <PrimaryLink href="/" variant="h4">
                                Travel Simply
                            </PrimaryLink>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={2} alignItems="center" wrap="nowrap">
                                <Grid item>
                                    <Box>
                                        <IconButton sx={{...darkPrimaryOnHover}}>
                                            <NotificationsIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item container alignItems="center" spacing={0} sx={{
                                    ...darkPrimaryOnHover
                                }} onClick={(e) => openProfileMenu(e)}>
                                    <Grid item>
                                        <Avatar src={user.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                    </Grid>
                                    <Grid item sx={{paddingLeft: 1}}>
                                        <Typography variant="body1">
                                            {user.data.username?.substring(0, user.data.username.length < 15 ? undefined : 15)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <ArrowDropDownIcon sx={{marginTop: .5}} />
                                    </Grid>
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
            </Container>
        </AppBar>
    )
}