import {useMemo} from 'react'
import { ClientTravelGroupNotifications } from "../../../../database/interfaces";
import UpdateIcon from '@mui/icons-material/Update';
import {Box, Grid, Typography, Avatar, Paper} from '@mui/material'
import { findSentDiff } from "../../../../utils/dates";
import dayjs from 'dayjs'

interface Props {
    update: ClientTravelGroupNotifications['data']['notifications'][0]
}

export default function UpdateCard({update}:Props) {

    const diff = useMemo(() => {
        return findSentDiff(dayjs(update.time['@ts']))
    }, [])

    return (
        <Box maxWidth={400} height="100%">
            <Paper sx={{height: '100%'}}>
                <Grid container direction="column" height="100%" justifyContent="space-between">
                    <Grid item>
                        <Box p={2}>
                            <Grid container wrap="nowrap" spacing={2} alignItems="center">
                                <Grid item>
                                    <Box m={1} sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}}}
                                    borderRadius="50%" display="flex" justifyContent="center" alignItems="center"
                                    bgcolor="primary.light">
                                        <UpdateIcon sx={{fontSize: {xs: 50, sm: 50}, color: '#fff'}} />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box mx={1}>
                                        <Typography variant="h6">
                                            {
                                                update.type === 'acceptProposal' ? `@${update.users?.at(0)}'s proposal was accepted` :
                                                update.type === 'rejectProposal' ? `@${update.users?.at(0)}'s proposal was rejected` :
                                                update.type === 'acceptJoinRequest' ? `@${update.users?.at(0)}'s join request was accepted` :
                                                update.type === 'rejectJoinRequest' ? `@${update.users?.at(0)}'s join request was rejected` :
                                                update.type === 'rescindInvitation' ? `@${update.users?.at(0)}'s invitation was rescinded` :
                                                update.type === 'leave' ? `@${update.users?.at(0)} left the Travel Group` :
                                                ''
                                            }
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box ml={2} mb={2}>
                            <Typography variant="body1">
                                {diff} ago.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}