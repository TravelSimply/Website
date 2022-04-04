import { Avatar, Box, Grid, Paper, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { ClientFilteredUser, ClientUser } from '../../../../../database/interfaces'
import { OrangeDenseSecondaryButton } from '../../../../mui-customizations/buttons';
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
            <Box mt={3}>
                <Grid container direction="column" justifyContent="space-between">
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box m={1}>
                                    <Avatar sx={{width: 100, height: 100}}
                                    src={friend.data.image?.src || '/default_profile.png'} imgProps={{referrerPolicy: 'no-referrer'}} />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box mx={1}>
                                    <Box mb={2}>
                                        <Typography variant="body1">
                                            @{friend.data.username}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {friend.data.firstName} {friend.data.lastName}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Box mt={0} p={1} bgcolor="orangeBg.light">
                            <Box>
                                <OrangeDenseSecondaryButton disabled={loading} onClick={() => removeFriend()}>
                                    Remove Friend
                                </OrangeDenseSecondaryButton> 
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}