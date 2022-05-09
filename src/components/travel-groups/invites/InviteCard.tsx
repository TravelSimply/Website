import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ClientTravelGroupInvitationWithSenderInfo } from "../../../database/interfaces";
import { findSentDiff } from "../../../utils/dates";
import {Avatar, Box, Grid, ListItemText, Paper, Typography} from '@mui/material'
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton } from "../../mui-customizations/buttons";

interface Props {
    invite: ClientTravelGroupInvitationWithSenderInfo;
    remove: () => void;
}

export default function InviteCard({invite, remove}:Props) {

    const [loading, setLoading] = useState(false)


    const sentDiff = useMemo(() => {
        return findSentDiff(dayjs(invite.data.timeSent['@ts']))
    }, [invite])

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
                                            src={invite.data.travelGroup.info[1] || '/default_travelgroup.png'} 
                                            imgProps={{referrerPolicy: 'no-referrer'}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <ListItemText primary={<Typography variant="h6">
                                                {invite.data.travelGroup.info[0]}
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
                                    <Grid container>
                                        <Grid item m={2}>
                                            <OrangeDensePrimaryButton disabled={loading}>
                                                Accept
                                            </OrangeDensePrimaryButton>
                                        </Grid>
                                        <Grid item m={2}>
                                            <OrangeDenseSecondaryButton disabled={loading}>
                                                Rescind
                                            </OrangeDenseSecondaryButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}