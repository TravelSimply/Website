import {query as q} from 'faunadb'
import client from '../database/fauna'
import { FriendRequest, User } from '../database/interfaces'

export async function createFriendRequests(to:string[], from:string) {

    await client.query(
        q.Map(to, q.Lambda('id', q.Create(q.Collection('friendRequests'), {data: {from, to: q.Var('id'), timeSent: q.Now()}})))
    ) 
}

export async function getFriendRequestsFromUser(id:string):Promise<{data: FriendRequest[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_from'), id), {size: 100}), (ref) => q.Get(ref))
    )
}

export async function getFriendRequestsToUser(id:string):Promise<{data: FriendRequest[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_to'), id), {size: 100}), (ref) => q.Get(ref))
    )
}