import { Box, Grid } from '@mui/material';
import {useCallback, useEffect, useMemo, useState} from 'react'
import { mutate } from 'swr';
import { ClientContactInfo, ClientTravelGroup, ClientTravelGroupJoinRequestWithFromPopulated, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForTravelGroupJoinRequests } from '../../../../utils/search';
import { handleAcceptRequest, handleRejectRequest } from '../utils/joinRequests';
import JoinRequestCard from './JoinRequestCard';

interface Props {
    joinRequests: ClientTravelGroupJoinRequestWithFromPopulated[];
    search: string;
    isAdmin: boolean;
    travellers: ClientUserWithContactInfo[];
    travelGroup: ClientTravelGroup;
}

export default function JoinRequests({joinRequests, search, isAdmin, travellers, travelGroup}:Props) {

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

    const acceptRequest = useCallback((contactInfo:ClientContactInfo) => {
        handleAcceptRequest(contactInfo, travellers, joinRequests, travelGroup)
    }, [travellers, joinRequests])

    const rejectRequest = useCallback((requestId:string) => {
        handleRejectRequest(requestId, joinRequests, travelGroup)
    }, [travellers, joinRequests])

    useMemo(() => {
        const match = travellers.find(t => joinRequests.find(req => req.data.from.ref['@ref'].id === t.ref['@ref'].id))
        if (!match) return

        mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests`, 
        joinRequests.filter(req => req.data.from.ref['@ref'].id !== match.ref['@ref'].id), false)
    }, [travellers])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedRequests.map((req, i) => (
                    <Grid item key={i} flexBasis={400} sx={{mb: 3, mx: 1}}>
                        <JoinRequestCard request={req} isAdmin={isAdmin}
                        travellers={travellers} travelGroup={travelGroup} accept={acceptRequest}
                        reject={rejectRequest} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}