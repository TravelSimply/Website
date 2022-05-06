import { Box, CircularProgress, Grid } from "@mui/material";
import { ClientContactInfo, ClientTravelGroup, ClientTravelGroupInvitationUsersPopulated, ClientTravelGroupInvitationWithToPopulated, ClientTravelGroupJoinRequestWithFromPopulated, ClientTravelGroupNotifications, ClientTravelGroupProposal, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import {useCallback, useMemo, useState} from 'react'
import dayjs from 'dayjs'
import {mutate} from 'swr'
import InviteCard from "../cards/InviteCard";
import JoinRequestCard from "../cards/JoinRequestCard";
import ProposalCard from '../cards/ProposalCard'
import { handleRemoveInvite } from "../utils/invites";
import { handleAcceptRequest, handleRejectRequest } from "../utils/joinRequests";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
    travellers: ClientUserWithContactInfo[];
    invites: ClientTravelGroupInvitationWithToPopulated[];
    requests: ClientTravelGroupJoinRequestWithFromPopulated[];
    proposals: ClientTravelGroupProposal[];
    notifications: ClientTravelGroupNotifications;
    search: string;
}

export default function Activity({travellers, invites, requests, proposals, notifications, search,
    travelGroup, user}:Props) {

    if (!travellers || !invites || !requests || !proposals || !notifications) {
        return (
            <Box textAlign="center">
                <CircularProgress />
            </Box>
        )
    }

    const [allItems, setAllItems] = useState([])

    useMemo(() => {
        setAllItems([
            ...invites.map(inv => {
                const u = travellers.find(u => u.ref['@ref'].id === inv.data.from)
                if (!u) {
                    return null
                }
                return {
                    ...inv,
                    data: {
                        ...inv.data,
                        from: u
                    }
                }
            }).filter(inv => inv).map(inv => ({type: 'invite', time: dayjs(inv.data.timeSent['@ts']), content: inv})),
            ...requests.map(req => ({type: 'request', time: dayjs(req.data.timeSent['@ts']), content: req})),
            ...proposals.map(prop => {
                const u = travellers.find(u => u.ref['@ref'].id === prop.data.by)
                if (!u) {
                    return null
                }
                return {
                    ...prop,
                    data: {
                        ...prop.data,
                        by: u
                    }
                }
            }).filter(prop => prop).map(prop => ({type: 'proposal', time: dayjs(prop.data.timeSent['@ts']), content: prop})),
            // ...notifications.data.notifications.map(not => ({type: 'update', time: dayjs(not.time['@ts']), content: not}))
        ].sort((a, b) => b.time.diff(a.time)))
    }, [invites, requests, proposals, notifications])

    const removeInvite = useCallback((inv:ClientTravelGroupInvitationUsersPopulated) => {
        handleRemoveInvite(inv, invites, travelGroup)
    }, [invites])

    const acceptRequest = useCallback((contactInfo:ClientContactInfo) => {
        handleAcceptRequest(contactInfo, travellers, requests, travelGroup)
    }, [travellers, requests])

    const rejectRequest = useCallback((requestId:string) => {
        handleRejectRequest(requestId, requests, travelGroup)
    }, [travellers, requests])

    const acceptProposal = (id:string) => {
        mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals`, 
            proposals.filter(p => p.ref['@ref'].id !== id), false
        )
    }

    const rejectProposal = (id:string) => {
        mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals`,
            proposals.filter(p => p.ref['@ref'].id !== id), false
        )
    }

    console.log(allItems)

    const isAdmin = useMemo(() => travelGroup.data.owner === user.ref['@ref'].id, [user, travelGroup])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {allItems.map((item, i) => (
                    <Grid item key={i} flexBasis={400} sx={{mb: 3, mx: 1}}>
                        {item.type === 'invite' ? 
                            <InviteCard invite={item.content as any} isAdmin={isAdmin}
                            travelGroup={travelGroup} remove={() => removeInvite(item.content as any)} />
                        : item.type === 'request' ?
                            <JoinRequestCard request={item.content as any} isAdmin={isAdmin}
                            travelGroup={travelGroup} travellers={travellers} accept={acceptRequest}
                            reject={rejectRequest} />
                        : item.type === 'proposal' ?
                            <ProposalCard isAdmin={isAdmin} user={user} travelGroup={travelGroup} proposal={item.content as any}
                            onAccepted={() => acceptProposal(item.content.ref['@ref'].id)}
                            onRejected={() => rejectProposal(item.content.ref['@ref'].id)} /> 
                        : null}
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}