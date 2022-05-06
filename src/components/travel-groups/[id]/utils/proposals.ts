import { Cache, mutate } from "swr";
import { ClientTravelGroup, ClientTravelGroupProposal } from "../../../../database/interfaces";

export function updateProposalsCache(proposal:ClientTravelGroupProposal, travelGroup:ClientTravelGroup, 
    cache:Cache) {
    
    const prevProposals = cache.get(`/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals`)
    if (!prevProposals) return
    mutate(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals`,
        [...prevProposals, proposal], false
    )
}