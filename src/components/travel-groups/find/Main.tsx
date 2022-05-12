import { Box, CircularProgress, Container } from "@mui/material";
import useSWR from "swr";
import { ClientBareTravelGroupInfo, ClientUser } from "../../../database/interfaces";
import {useRouter} from 'next/router'
import { useSearchedTravelGroups } from "../../hooks/travelGroups";
import Search from "./Search";
import { useMemo, useState } from "react";
import TravelGroupCard from "../index/TravelGroupCard";

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const {data:bareGroupInfo} = useSWR<ClientBareTravelGroupInfo[]>(
        `/api/users/${user.ref['@ref'].id}/friends/travel-groups/bare-info`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const filteredGroups = useSearchedTravelGroups(bareGroupInfo)

    console.log('filteredGroups', filteredGroups)
    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Search />
                </Box>
                {typeof filteredGroups === 'undefined' ? <Box>
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                </Box>: 
                <Box>
                    {filteredGroups === 0 ? <Box>
                        Error! 
                    </Box> : !filteredGroups ? '' : <Box>
                        {filteredGroups.map(group => (
                            <Box key={group.ref['@ref'].id}>
                                <TravelGroupCard travelGroup={group} user={user} />
                            </Box>
                        ))} 
                    </Box>}
                </Box>}
            </Container>
        </Box>
    )
}