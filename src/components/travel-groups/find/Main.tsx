import { Box, CircularProgress, Container, Typography } from "@mui/material";
import useSWR from "swr";
import { ClientBareTravelGroupInfo, ClientTravelGroup, ClientUser } from "../../../database/interfaces";
import {useRouter} from 'next/router'
import { useSearchedTravelGroups } from "../../hooks/travelGroups";
import Search from "./Search";
import { useMemo, useState } from "react";
import TravelGroupCard from "../index/TravelGroupCard";
import { OrangePrimaryButton } from "../../mui-customizations/buttons";
import Link from 'next/link'

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
                </Box> : 
                !user.data.friends || user.data.friends?.length === 0 ? <Box>
                    <Container maxWidth="sm">
                        <Box textAlign="center">
                            <Typography variant="h6" gutterBottom>
                                Add your friends to find groups to join! 
                            </Typography>
                            <Link href="/profile/friends/add">
                                <a>
                                    <OrangePrimaryButton>
                                        Add Friends
                                    </OrangePrimaryButton>
                                </a>
                            </Link>
                        </Box>
                    </Container>
                </Box> : <Box>
                    {filteredGroups === 0 ? <Box textAlign="center">
                        An error occured while loading Travel Groups.
                    </Box> : !filteredGroups ? '' : (filteredGroups as ClientTravelGroup[]).length === 0 ? <Box>
                        <Container maxWidth="sm">
                            <Box textAlign="center">
                                <Typography variant="h6">
                                    No groups found! Try widening your search.
                                </Typography>
                            </Box>
                        </Container>
                    </Box> : <Box>
                        {(filteredGroups as ClientTravelGroup[]).map(group => (
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