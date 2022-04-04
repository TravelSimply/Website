import { Avatar, Box, Grid, ListItemText, Paper, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { ClientFilteredUser, ClientUser } from '../../../../database/interfaces'
import { OrangeDenseSecondaryButton } from '../../../mui-customizations/buttons';
import {mutate} from 'swr'
import dayjs from 'dayjs'

interface Props {
    children: React.ReactNode;
    user: ClientUser;
    timeSent: string;
}

export default function InviteCard({user, timeSent, children}:Props) {

    const daysSentAgo = useMemo(() => {
        return dayjs().diff(dayjs(timeSent), 'days')
    }, [timeSent])

    return (
        <Paper>
            <Box mt={3} mx={3}>
                <Grid container direction="column" justifyContent="space-between">
                    <Grid item>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <Box m={1}>
                                    <Avatar sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}}}
                                    src={user.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                </Box>
                            </Grid>
                            <Grid item sx={{paddingY: 1}}>
                                <Grid container spacing={{xs: 0, sm: 3}} sx={{height: "100%"}} direction="column" justifyContent="space-between">
                                    <Grid item>
                                        <Box mx={1}>
                                            <ListItemText primary={`@${user.data.username}`} 
                                            secondary={user.data.firstName + ' ' + user.data.lastName} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box>
                                            <Typography variant="subtitle2">
                                                Sent {daysSentAgo === 0 ? 'today' : daysSentAgo === 1 ? 'yesterday' : daysSentAgo + ' days ago'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}