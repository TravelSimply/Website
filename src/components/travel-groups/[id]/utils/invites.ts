import { ClientTravelGroup, ClientTravelGroupInvitationUsersPopulated, ClientTravelGroupInvitationWithToPopulated } from "../../../../database/interfaces";
import {mutate} from 'swr'

export function handleRemoveInvite(inv:ClientTravelGroupInvitationUsersPopulated, 
    invites:ClientTravelGroupInvitationWithToPopulated[], travelGroup:ClientTravelGroup) {

    const invitesCopy = [...invites]
    for (let i = 0; i < invitesCopy.length; i++) {
        if (invitesCopy[i].ref['@ref'].id === inv.ref['@ref'].id) {
            invitesCopy.splice(i, 1)
            break
        }
    }
    mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations`, invitesCopy, false)
}