import { Avatar, Box, Grid, ListItemText, Paper, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { ClientFilteredUser, ClientUser } from '../../../../../database/interfaces'
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton } from '../../../../mui-customizations/buttons';
import {mutate} from 'swr'

interface Props {
    users: ClientUser[];
    friendIndex: number;
}

export default function FriendCard({users, friendIndex}:Props) {

    const friend = useMemo(() => users[friendIndex], [friendIndex, users])

    const [loading, setLoading] = useState(false)

    const removeFriend = async () => {
        try {

            // make post request to remove friend

            const usersCopy = [...users]
            usersCopy.splice(friendIndex, 1)

            console.log(usersCopy)

            mutate('/api/users/profile/friends', usersCopy, false)
        } catch (e) {

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