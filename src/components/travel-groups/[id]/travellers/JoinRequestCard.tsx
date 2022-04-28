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
}

export default function JoinRequestCard({request, isAdmin, travellers, travelGroup, accept}:Props) {

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
                    userContactInfo: true
                }
            })

            accept(contactInfo)
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
                            <Box ml={1} mt={1}>
                                <Typography variant="body1">
                                    Requested {sentDiff} ago.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    {isAdmin && <Grid item>
                        <Box p={2} height="100%" bgcolor="orangeBg.light">
                            <Grid container spacing={3}>
                                <Grid item>
                                    <OrangeDensePrimaryButton disabled={loading} onClick={() => acceptRequest()}>
                                        Accept
                                    </OrangeDensePrimaryButton>
                                </Grid>
                                <Grid item>
                                    <OrangeDenseSecondaryButton disabled={loading}>
                                        Reject
                                    </OrangeDenseSecondaryButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>}
                </Grid>
            </Paper>
        </Box>
    )
}