import { Box, Container } from "@mui/material";
import useSWR from "swr";
import { ClientBareTravelGroupInfo, ClientUser } from "../../../database/interfaces";
import {useRouter} from 'next/router'
import { useSearchedTravelGroups } from "../../hooks/travelGroups";
import Search from "./Search";

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const {data:bareGroupInfo} = useSWR<ClientBareTravelGroupInfo[]>(
        `/api/users/${user.ref['@ref'].id}/friends/travel-groups/bare-info`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const filteredGroups = useSearchedTravelGroups(bareGroupInfo)

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Container maxWidth="sm">
                        <Search />
                    </Container>
                </Box>
            </Container>
        </Box>
    )
}