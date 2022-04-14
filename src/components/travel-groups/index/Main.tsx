import { Box, Container, Paper } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../database/interfaces";
import TravelGroupCard from "./TravelGroupCard";

interface Props {
    user: ClientUser;
    travelGroups: ClientTravelGroup[];
}

export default function Main({user, travelGroups}:Props) {

    return (
        <Box mt={3} ml={3}>
            <Container maxWidth="md">
                {travelGroups.length === 0 ?
                'show join or create travel group page' :
                <Box>
                    {travelGroups.map(group => (
                        <Box key={group.ref['@ref'].id}>
                            <TravelGroupCard user={user} travelGroup={group} />
                        </Box>
                    ))}     
                </Box>}
            </Container>
        </Box>
    )
}