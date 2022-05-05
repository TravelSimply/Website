import {useCallback, useMemo, useState} from 'react'
import { ClientContactInfo, ClientTravelGroup, ClientTravelGroupJoinRequestWithFromPopulated, ClientUserWithContactInfo } from "../../../../database/interfaces";
import dayjs from 'dayjs'
import { findSentDiff } from '../../../../utils/dates';
import {Box, Paper, Grid, Avatar, Typography, ListItemText} from '@mui/material'
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton } from '../../../mui-customizations/buttons';
import axios from 'axios';
import { mutate } from 'swr';

interface Props {
    request: ClientTravelGroupJoinRequestWithFromPopulated;
    isAdmin: boolean;
    travellers: ClientUserWithContactInfo[];
    travelGroup: ClientTravelGroup;
    accept: (contactInfo:ClientContactInfo) => void;
    reject: (requestId:string) => void;
}

export default function JoinRequestCard({request, isAdmin, travellers, travelGroup, accept, reject}:Props) {

    const [loading, setLoading] = useState(false)

    const sentDiff = useMemo(() => {
        return findSentDiff(dayjs(request.data.timeSent['@ts']))
    }, [request])

    const acceptRequest = async () => {
        setLoading(true)

        try {

            const {data: contactInfo} = await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests/accept`,
                data: {
                    requestId: request.ref['@ref'].id,
                    travellerId: request.data.from.ref['@ref'].id,
                    travellerUsername: request.data.from.data.username || '',
                    userContactInfo: true
                }
            })

            accept(contactInfo)
        } catch (e) {
            setLoading(false)
        }
    }

    const rejectRequest = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests/reject`,
                data: {
                    requestId: request.ref['@ref'].id,
                    travellerUsername: request.data.from.data.username || ''
                }
            })

            reject(request.ref['@ref'].id)
        } catch (e) {
            setLoading(false)
        }
    }

    return (
        <Box maxWidth={400} height="100%">
            <Paper sx={{height: '100%'}}>
                <Grid container direction="column" height="100%" justifyContent="space-between">
                    <Grid item>
                        <Box p={2}>
                            <Box>
                                <Grid container wrap="nowrap" spacing={2} alignItems="center">
                                    <Grid item>
                                        <Box m={1}>
                                            <Avatar sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}}}
                                            src={request.data.from.data.image?.src || '/default_profile.png'} 
                                            imgProps={{referrerPolicy: 'no-referrer'}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <ListItemText primary={<Typography variant="h6">
                                                {request.data.from.data.firstName} {request.data.from.data.lastName}
                                            </Typography>} secondary={<Typography color="text.secondary" variant="body1">
                                                @{request.data.from.data.username}
                                            </Typography>} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Grid container height="100%" direction="column" justifyContent="space-between">
                            <Grid item>
                                <Box ml={1} mb={2}>
                                    <Typography variant="body1">
                                        Requested to join {sentDiff} ago.
                                    </Typography>
                                </Box>
                            </Grid>
                            {isAdmin && <Grid item>
                                <Box bgcolor="orangeBg.light">
                                    <Grid container>
                                        <Grid item m={2}>
                                            <OrangeDensePrimaryButton disabled={loading} onClick={() => acceptRequest()}>
                                                Accept
                                            </OrangeDensePrimaryButton>
                                        </Grid>
                                        <Grid item m={2}>
                                            <OrangeDenseSecondaryButton disabled={loading} onClick={() => rejectRequest()}>
                                                Reject
                                            </OrangeDenseSecondaryButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}