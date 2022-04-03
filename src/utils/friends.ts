import {query as q} from 'faunadb'
import client from '../database/fauna'
import { getFriendRequestsFromUser, getFriendRequestsToUser } from './friendRequests'
import { getUser } from './users'

export async function getFriendsInvited(id:string) {

    const invitations = await getFriendRequestsFromUser(id)

    if (!invitations || !invitations.data) {
        return []
    }

    const users = await Promise.all(invitations.data.map(inv => getUser(inv.data.to)))

    return users
}

export async function getFriendsInviting(id:string) {

    const invitations = await getFriendRequestsToUser(id)

    if (!invitations || !invitations.data) {
        return []
    }

    const users = await Promise.all(invitations.data.map(inv => getUser(inv.data.from)))

    return users
}