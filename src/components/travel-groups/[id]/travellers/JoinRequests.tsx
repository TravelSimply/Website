import { Box, Grid } from '@mui/material';
import {useCallback, useEffect, useMemo, useState} from 'react'
import { mutate } from 'swr';
import { ClientContactInfo, ClientTravelGroup, ClientTravelGroupJoinRequestWithFromPopulated, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForTravelGroupJoinRequests } from '../../../../utils/search';
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

        const user = joinRequests.find(u => u.data.from.ref['@ref'].id === contactInfo.data.userId)?.data.from

        mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/travellers`,
        [...travellers, {
            ...user,
            data: {
                ...user.data,
                contactInfo
            } 
        }].sort((a, b) => a.data.lastName?.localeCompare(b.data.lastName)), false)

    }, [travellers, joinRequests])

    const rejectRequest = useCallback((requestId:string) => {

        mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests`,
        joinRequests.filter(req => req.ref['@ref'].id !== requestId), false)
        
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