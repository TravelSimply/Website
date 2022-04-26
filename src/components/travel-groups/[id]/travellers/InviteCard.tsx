import { ClientTravelGroupInvitationUsersPopulated } from "../../../../database/interfaces";
import {Box, Paper, Grid, Typography, Avatar, ListItemText} from '@mui/material'
import { useMemo } from "react";
import dayjs from "dayjs";
import { OrangeDensePrimaryButton } from "../../../mui-customizations/buttons";

interface Props {
    invite: ClientTravelGroupInvitationUsersPopulated;
    isAdmin: boolean;
}

export default function InviteCard({invite, isAdmin}:Props) {

    const sentDiff = useMemo(() => {
        const date = dayjs(invite.data.timeSent['@ts'])
        let diff = dayjs().diff(date, 'days')
        if (diff >= 1) {
            return diff + ' days'
        }
        diff = dayjs().diff(date, 'hours')
        if (diff >= 1) {
            return diff + ' hours'
        }
        return dayjs().diff(date, 'minutes')
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
                            <Box ml={1} mt={1}>
                                <Typography variant="body1">
                                    Invited by @{invite.data.from.data.username} {sentDiff} ago.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    {isAdmin && <Grid item>
                        <Box p={2} height="100%" bgcolor="orangeBg.light">
                            <OrangeDensePrimaryButton>
                                Rescind
                            </OrangeDensePrimaryButton>
                        </Box>
                    </Grid>}
                </Grid>
            </Paper>
        </Box>
    )
}