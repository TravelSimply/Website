import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../../database/interfaces";
import { findSentDiff } from "../../../utils/dates";
import {Avatar, Box, Grid, ListItemText, NoSsr, Paper, Typography} from '@mui/material'
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton } from "../../mui-customizations/buttons";
import Link from 'next/link'
import { PrimaryLink } from "../../misc/links";
import Snackbar from '../../misc/snackbars'
import axios from "axios";

interface Props {
    user: ClientUser;
    invite: ClientTravelGroupInvitationWithSenderInfo;
    accept: () => void;
    reject: () => void;
}

export default function InviteCard({user, invite, accept, reject}:Props) {

    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const toDiscard = useMemo(() => !invite.data.travelGroup.info[0] || !invite.data.travelGroup.info[0][0], [invite])

    const sentDiff = useMemo(() => {
        return findSentDiff(dayjs(invite.data.timeSent['@ts']))
    }, [invite])

    const rejectInvite = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${invite.data.travelGroup.id}/invitations/reject`,
                data: {
                    toUsername: user.data.username,
                    inviteId: invite.ref['@ref'].id
                }
            })

            reject()
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Rejecting Invite'})
            setLoading(false)
        }
    }

    const acceptInvite = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${invite.data.travelGroup.id}/invitations/accept`,
                data: {
                    toUsername: user.data.username,
                    inviteId: invite.ref['@ref'].id
                }
            })

            accept()
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Accepting Invite'})
            setLoading(false)
        }
    }

    const discardInvite = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${invite.data.travelGroup.id}/invitations/discard`,
                data: {
                    inviteId: invite.ref['@ref'].id
                }
            })

            reject()
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Discarding Invite'})
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
                                            <Avatar variant="square" sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}, 
                                            borderRadius: 1}}
                                            src={(invite.data.travelGroup.info[0] &&  invite.data.travelGroup.info[0][1]) || '/default_travelgroup.png'} 
                                            imgProps={{referrerPolicy: 'no-referrer'}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <ListItemText primary={!toDiscard ? <PrimaryLink href="/travel-groups/[id]/preview"
                                            as={`/travel-groups/${invite.data.travelGroup.id}/preview`}>
                                                <a>
                                                    <Typography variant="h6">
                                                        {invite.data.travelGroup.info[0][0]}
                                                    </Typography>
                                                </a>
                                            </PrimaryLink> : <Typography variant="h6">
                                                Disbanded Travel Group
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
                                <Box ml={3} mb={2}>
                                    <Typography variant="body1">
                                        Invited by @{invite.data.from.username} {sentDiff} ago.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box bgcolor="orangeBg.light">
                                    {toDiscard ? <Grid container>
                                        <Grid item ml={3} my={2}>
                                            <OrangeDensePrimaryButton disabled={loading}
                                            onClick={() => discardInvite()}>
                                                Discard
                                            </OrangeDensePrimaryButton>
                                        </Grid>
                                    </Grid> : 
                                    <Grid container>
                                        <Grid item ml={3} my={2}>
                                            <OrangeDensePrimaryButton disabled={loading}
                                            onClick={() => acceptInvite()}>
                                                Accept
                                            </OrangeDensePrimaryButton>
                                        </Grid>
                                        <Grid item ml={3} my={2}>
                                            <OrangeDenseSecondaryButton disabled={loading}
                                            onClick={() => rejectInvite()}>
                                                Reject
                                            </OrangeDenseSecondaryButton>
                                        </Grid>
                                    </Grid>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}