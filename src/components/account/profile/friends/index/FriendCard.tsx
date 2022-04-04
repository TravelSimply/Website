import { Avatar, Box, Grid, ListItemText, Paper, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { ClientFilteredUser, ClientUser } from '../../../../../database/interfaces'
import { OrangeDensePrimaryButton} from '../../../../mui-customizations/buttons';
import {mutate} from 'swr'
import axios from 'axios';

interface Props {
    users: ClientUser[];
    friendIndex: number;
    setSnackbarMsg: Dispatch<SetStateAction<{type:string;content:string}>>;
}

export default function FriendCard({users, friendIndex, setSnackbarMsg}:Props) {

    const friend = useMemo(() => users[friendIndex], [friendIndex, users])

    const [loading, setLoading] = useState(false)

    const removeFriend = async () => {
        setLoading(true)
        try {

            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/remove',
                data: {id: friend.ref['@ref'].id}
            })

            const usersCopy = [...users]
            usersCopy.splice(friendIndex, 1)

            setSnackbarMsg({type: 'success', content: 'Removed Friend'})
            mutate('/api/users/profile/friends', usersCopy, false)
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <Paper>
            <Box mt={3} mx={3}>
                <Grid container direction="column" justifyContent="space-between">
                    <Grid item>
                        <Grid container justifyContent="center" >
                            <Grid item>
                                <Box m={1}>
                                    <Avatar sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}}}
                                    src={friend.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                </Box>
                            </Grid>
                            <Grid item sx={{paddingY: 1}}>
                                <Box mx={1}>
                                    <ListItemText primary={`@${friend.data.username}`} 
                                    secondary={friend.data.firstName + ' ' + friend.data.lastName} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Box mx={-3} pl={3} py={1} bgcolor="orangeBg.light">
                            <Box>
                                <OrangeDensePrimaryButton disabled={loading} onClick={() => removeFriend()}>
                                    Remove Friend
                                </OrangeDensePrimaryButton> 
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}