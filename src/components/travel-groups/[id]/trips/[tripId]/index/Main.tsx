import { Box, Container, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";
import Overview from "./Overview";

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function Main({user, trip}:Props) {

    const [startDate, endDate] = useMemo(() => {
        return [
            dayjs(trip.data.date.start['@date']).format('MMMM D'),
            dayjs(trip.data.date.end['@date']).format('MMMM D')
        ]
    }, [])

    return (
        <Box my={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Paper>
                        <Box p={3}>
                            <Overview trip={trip} /> 
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}