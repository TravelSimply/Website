import { Box, CircularProgress, Grid } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../database/interfaces";
import { UserNotifications } from "../hooks/userNotifications";
import Notifications from "./Notifications";

interface Props {
    user: ClientUser;
    travelGroups: ClientTravelGroup[];
    notifications: UserNotifications;
}

export default function Main({user, travelGroups, notifications}:Props) {

    return (
        <Box m={3}>
            <Grid container wrap="nowrap">
                <Grid item flex={1} minWidth={{xs: 0, sm: 600}}>
                    <Box>
                        Travelling Info
                    </Box>
                </Grid>
                <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "clamp(300px, 400px, 40%)"}}>
                    {!notifications.filtered ? <Box textAlign="center">
                        <CircularProgress />
                    </Box> : <Notifications notifications={notifications} />}
                </Grid>
            </Grid>
        </Box>
    )
}