import { Box, CircularProgress, Container } from "@mui/material";
import useSWR from "swr";
import { ClientBareTravelGroupInfo, ClientUser } from "../../../database/interfaces";
import {useRouter} from 'next/router'
import { useSearchedTravelGroups } from "../../hooks/travelGroups";
import Search from "./Search";
import { useMemo, useState } from "react";
import TravelGroupCard from "../index/TravelGroupCard";
import { OrangePrimaryButton } from "../../mui-customizations/buttons";

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const {data:bareGroupInfo} = useSWR<ClientBareTravelGroupInfo[]>(
        `/api/users/${user.ref['@ref'].id}/friends/travel-groups/bare-info`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const {filteredTravelGroups:filteredGroups, loadingNewSearch, loadingMore, loadMore, moreToLoad}
     = useSearchedTravelGroups(bareGroupInfo)

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Search />
                </Box>
                {loadingNewSearch ? <Box>
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                </Box>: 
                <Box>
                    {filteredGroups === 0 ? <Box textAlign="center">
                        An error occured while loading Travel Groups.
                    </Box> : !filteredGroups ? '' : <Box>
                        {filteredGroups.map(group => (
                            <Box key={group.ref['@ref'].id}>
                                <TravelGroupCard travelGroup={group} user={user} />
                            </Box>
                        ))} 
                    </Box>}
                </Box>}
                {moreToLoad && <Box>
                    <Box textAlign="center">
                        <OrangePrimaryButton sx={{minWidth: 200}} disabled={loadingNewSearch || loadingMore}
                        onClick={() => loadMore()}>
                            Load More
                        </OrangePrimaryButton>
                    </Box>
                </Box>}
            </Container>
        </Box>
    )
}