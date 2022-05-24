import { Box, Container, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import Calendar from "../../../calendar/Calendar";
import Overview from "../index/Overview";
import Action from './Action'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
    joinRequests: {'@ref': {id: string}}[];
}

export default function Main({user, travelGroup, invites, joinRequests}:Props) {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="md">
                <Box mb={1}>
                    <Action user={user} travelGroup={travelGroup} invites={invites}
                    joinRequests={joinRequests} />
                </Box>
                <Box mb={3}>
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