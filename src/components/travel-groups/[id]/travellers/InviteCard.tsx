import { ClientTravelGroupInvitationUsersPopulated } from "../../../../database/interfaces";
import {Box, Paper, Grid, Typography, Avatar, ListItemText} from '@mui/material'

interface Props {
    invite: ClientTravelGroupInvitationUsersPopulated;
    isAdmin: boolean;
}

export default function InviteCard({invite, isAdmin}:Props) {

    return (
        <Box maxWidth={400} height="100%">
            <Paper sx={{height: '100%'}}>
                <Grid container direction="column" height="100%" justifyContent="space-between">
                    <Grid item>
                        <Box p={2}>
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
                                        <ListItemText primary={<Typography variant="body1">
                                            {invite.data.to.data.firstName} {invite.data.to.data.lastName}
                                        </Typography>} secondary={<Typography variant="body2">
                                            @{invite.data.to.data.username}
                                        </Typography>} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    {isAdmin && <Grid item>
                        
                    </Grid>}
                </Grid>
            </Paper>
        </Box>
    )
}