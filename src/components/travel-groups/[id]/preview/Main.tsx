import { Box, Container, Paper } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import Overview from "../index/Overview";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="md">
                <Box>
                    <Paper>
                        <Box p={3}>
                            <Overview travelGroup={travelGroup} />
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}