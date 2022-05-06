import { Box, Container } from "@mui/material";
import { ClientTravelGroup, ClientTravelGroupInvitationWithToPopulated, ClientTravelGroupJoinRequestWithFromPopulated, ClientTravelGroupNotifications, ClientTravelGroupProposal, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { PrimaryLink } from "../../../misc/links";
import useSWR from 'swr'
import {useState} from 'react'
import Activity from './Activity'
import Search from "./Search";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    const {data:travellers, isValidating:isValidatingTravellers} = useSWR<ClientUserWithContactInfo[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/travellers`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000})

    const {data:invites} = useSWR<ClientTravelGroupInvitationWithToPopulated[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const {data: requests} = useSWR<ClientTravelGroupJoinRequestWithFromPopulated[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const {data: proposals} = useSWR<ClientTravelGroupProposal[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const {data: notifications} = useSWR<ClientTravelGroupNotifications>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/notifications`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState([true, true, true, true])

    console.log('travellers', travellers)
    console.log('invites', invites)
    console.log('requests', requests)
    console.log('proposals', proposals)
    console.log('notifications', notifications)

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Box textAlign="center" maxWidth="lg">
                    <PrimaryLink href="/travel-groups/[id]" as={`/travel-groups/${travelGroup.ref['@ref'].id}`}
                        variant="h4">
                        {travelGroup.data.name}
                    </PrimaryLink>
                </Box>
            </Box>
            <Container maxWidth="lg">
                <Box mb={3}>
                    <Search search={setSearch} setSearch={setSearch} filters={filters} setFilters={setFilters} />
                </Box>
                <Box>
                    <Activity travellers={travellers} invites={invites} requests={requests}
                    proposals={proposals} notifications={notifications} search={search}
                    travelGroup={travelGroup} user={user} />
                </Box>
            </Container>
        </Box>
    )
}