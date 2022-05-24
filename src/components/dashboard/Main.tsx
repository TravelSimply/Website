import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../database/interfaces";
import { UserNotifications } from "../hooks/userNotifications";
import { PrimaryLink } from "../misc/links";
import Notifications from "./Notifications";

interface Props {
    user: ClientUser;
    travelGroups: ClientTravelGroup[];
    notifications: UserNotifications;
}

export default function Main({user, travelGroups, notifications}:Props) {

    return (
        <Box my={3}>
            <Grid container wrap="nowrap">
                <Grid item flex={1} minWidth={{xs: 0, sm: 600}}>
                    <Box mx={3}>
                        <Paper>
                            <Box p={2}>
                                <Box textAlign="center">
                                    <PrimaryLink href="/travel-groups" variant="h6">
                                        {travelGroups.length} Travel Groups
                                    </PrimaryLink>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
                <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "clamp(300px, 400px, 40%)"}}>
                    <Box mr={3}>
                        {!notifications.filtered ? <Box textAlign="center">
                            <CircularProgress />
                        </Box> : <Notifications notifications={notifications} />}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}