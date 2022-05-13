import { ClientContactInfo, ClientTravelGroup, ClientTravelGroupJoinRequestWithFromPopulated, ClientUserWithContactInfo } from "../../../../database/interfaces";
import {mutate} from 'swr'

export function handleAcceptRequest(contactInfo:ClientContactInfo, travellers:ClientUserWithContactInfo[],
    joinRequests:ClientTravelGroupJoinRequestWithFromPopulated[], travelGroup:ClientTravelGroup) {
    

    const user = joinRequests.find(u => u.data.from.ref['@ref'].id === contactInfo.data.userId)?.data.from

    mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/travellers`,
    [...travellers, {
        ...user,
        data: {
            ...user.data,
            contactInfo
        } 
    }].sort((a, b) => a.data.lastName?.localeCompare(b.data.lastName)), false)
}

export function handleRejectRequest(requestId:string, joinRequests:ClientTravelGroupJoinRequestWithFromPopulated[],
    travelGroup:ClientTravelGroup) {
    
    mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests`,
    joinRequests.filter(req => req.ref['@ref'].id !== requestId), false)
}