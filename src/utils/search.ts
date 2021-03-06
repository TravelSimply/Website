import { ClientFilteredUser, ClientPopulatedFromFriendRequest, ClientPopulatedToFriendRequest, ClientTravelGroupInvitationUsersPopulated, ClientTravelGroupInvitationWithSenderInfo, ClientTravelGroupJoinRequestWithFromPopulated, ClientUser, ClientUserWithContactInfo } from "../database/interfaces";

export function matchesAtLeastOneTerm(search:string, terms:string[]) {

    for (const term of terms) {
        if (!term) {
            continue
        }
        if (term.toLowerCase().includes(search)) {
            return true
        }
    }
    return false
}

export function searchForToInvites(search:string, invites:ClientPopulatedToFriendRequest[]) {

    const lcSearch = search.toLowerCase().trim()

    return invites.filter(inv => {
        return matchesAtLeastOneTerm(lcSearch, [inv.data.to.data.caseInsensitiveUsername, inv.data.to.data.firstName,
        inv.data.to.data.lastName])
    })
}

export function searchForFromInvites(search:string, invites:ClientPopulatedFromFriendRequest[]) {

    const lcSearch = search.toLowerCase().trim()

    return invites.filter(inv => {
        return matchesAtLeastOneTerm(lcSearch, [inv.data.from.data.caseInsensitiveUsername, inv.data.from.data.firstName,
        inv.data.from.data.lastName])
    })
}

export function searchForUsers(search:string, users:(ClientFilteredUser | ClientUserWithContactInfo)[]) {

    const lcSearch = search.toLowerCase().trim()

    return users.filter(user => {
        return matchesAtLeastOneTerm(lcSearch, [user.data.caseInsensitiveUsername, user.data.firstName, user.data.lastName])
    })
}

export function searchForTravelGroupInvites(search:string, invites:ClientTravelGroupInvitationUsersPopulated[]) {

    const lcSearch = search.toLowerCase().trim()

    return invites.filter(inv => {
        return matchesAtLeastOneTerm(lcSearch, [
            inv.data.from.data.caseInsensitiveUsername,
            inv.data.from.data.firstName,
            inv.data.from.data.lastName,
            inv.data.to.data.caseInsensitiveUsername,
            inv.data.to.data.firstName,
            inv.data.to.data.lastName
        ])
    })
}

export function searchForTravelGroupJoinRequests(search: string, requests:ClientTravelGroupJoinRequestWithFromPopulated[]) {

    const lcSearch = search.toLowerCase().trim()

    return requests.filter(req => {
        return matchesAtLeastOneTerm(lcSearch, [
            req.data.from.data.caseInsensitiveUsername,
            req.data.from.data.firstName,
            req.data.from.data.lastName
        ])
    })
}

export function searchForTravelGroupInvitesWithSender(search:string, invites:ClientTravelGroupInvitationWithSenderInfo[]) {

    const lcSearch = search.toLowerCase().trim()

    return invites.filter(inv => {
        return matchesAtLeastOneTerm(lcSearch, [
            inv.data.travelGroup.info[0],
            inv.data.from.username
        ])
    })
}