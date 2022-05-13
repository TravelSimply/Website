import { ClientTravelGroup, ClientTravelGroupInvitationUsersPopulated } from "../../../../database/interfaces";
import {Box, Paper, Grid, Typography, Avatar, ListItemText} from '@mui/material'
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { OrangeDensePrimaryButton } from "../../../mui-customizations/buttons";
import { findSentDiff } from "../../../../utils/dates";
import axios from "axios";

interface Props {
    invite: ClientTravelGroupInvitationUsersPopulated;
    isAdmin: boolean;
    travelGroup: ClientTravelGroup;
    remove: () => void;
}

export default function InviteCard({invite, isAdmin, travelGroup, remove}:Props) {

    const [loading, setLoading] = useState(false)

    const sentDiff = useMemo(() => {
        return findSentDiff(dayjs(invite.data.timeSent['@ts']))
    }, [invite])

    const rescindInvite = async () => {
        setLoading(true)

        try {
            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations/rescind`,
                data: {
                    inviteId: invite.ref['@ref'].id,
                    to: invite.data.to.data.username || ''
                }
            })
            remove()
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
                                            src={invite.data.to.data.image?.src || '/default_profile.png'} 
                                            imgProps={{referrerPolicy: 'no-referrer'}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <ListItemText primary={<Typography variant="h6">
                                                {invite.data.to.data.firstName} {invite.data.to.data.lastName}
                                            </Typography>} secondary={<Typography color="text.secondary" variant="body1">
                                                @{invite.data.to.data.username}
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
                                        Invited by @{invite.data.from.data.username} {sentDiff} ago.
                                    </Typography>
                                </Box>
                            </Grid>
                            {isAdmin && <Grid item>
                                <Box bgcolor="orangeBg.light">
                                    <Grid container>
                                        <Grid item ml={3} my={2}>
                                            <OrangeDensePrimaryButton onClick={() => rescindInvite()} disabled={loading}>
                                                Rescind
                                            </OrangeDensePrimaryButton>
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