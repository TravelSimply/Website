import { Box, Grid } from '@mui/material';
import {useMemo, useState} from 'react'
import { ClientTravelGroupJoinRequestWithFromPopulated } from "../../../../database/interfaces";
import { searchForTravelGroupJoinRequests } from '../../../../utils/search';
import JoinRequestCard from './JoinRequestCard';

interface Props {
    joinRequests: ClientTravelGroupJoinRequestWithFromPopulated[];
    search: string;
    isAdmin: boolean;
}

export default function JoinRequests({joinRequests, search, isAdmin}:Props) {

    if (!joinRequests) {
        return null
    }

    const [searchedRequests, setSearchedRequests] = useState<ClientTravelGroupJoinRequestWithFromPopulated[]>([])

    useMemo(() => {

        if (!joinRequests) {
            return
        }

        setSearchedRequests(joinRequests)
    }, [joinRequests])

    useMemo(() => {

        if (!joinRequests) {
            return
        }

        if (!search.trim()) {
            setSearchedRequests(joinRequests)
        }

        setSearchedRequests(searchForTravelGroupJoinRequests(search, joinRequests))
    }, [search])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedRequests.map((req, i) => (
                    <Grid item key={i} flexBasis={400} sx={{mb: 3, mx: 1}}>
                        <JoinRequestCard request={req} isAdmin={isAdmin} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}