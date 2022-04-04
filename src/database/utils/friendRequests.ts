import {query as q} from 'faunadb'
import client from '../fauna'
import { FriendRequest, PopulatedFromFriendRequest, PopulatedToFriendRequest, User } from '../interfaces'

export async function createFriendRequests(to:string[], from:string) {

    await client.query(
        q.Map(to, q.Lambda('id', q.Create(q.Collection('friendRequests'), {data: {from, to: q.Var('id'), timeSent: q.Now()}})))
    ) 
}

export async function getFriendRequest(id:string):Promise<FriendRequest> {

    return await client.query(
        q.Get(q.Ref(q.Collection('friendRequests'), id))
    )
}

export async function getFriendRequestsFromUser(id:string):Promise<{data: FriendRequest[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_from'), id), {size: 100}), (ref) => q.Get(ref))
    )
}

export async function getPopulatedFriendRequestsFromUser(userId:string):Promise<PopulatedToFriendRequest[]> {

    return await client.query(
        q.Let(
            {
                'requests': q.Select(['data'], q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_from'), userId), {size: 100}), (ref) => q.Get(ref)))
            },
            q.Map(q.Var('requests'), q.Lambda('request', (
                {
                    ref: q.Select(['ref'], q.Var('request')),
                    data: {
                        from: userId,
                        to: q.Get(q.Ref(q.Collection('users'), q.Select(['data', 'to'], q.Var('request')))),
                        timeSent: q.Select(['data', 'timeSent'], q.Var('request'))
                    }
                }
            )))
        )
    )
}

export async function getToOfFriendRequestsFromUser(id:string):Promise<{data: string[]}> {

    return await client.query(
        q.Paginate(q.Match(q.Index('friendRequests_by_from_w_to'), id))
    )
}

export async function getFriendRequestsToUser(id:string):Promise<{data: FriendRequest[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_to'), id), {size: 100}), (ref) => q.Get(ref))
    )
}

export async function getPopulatedRequestsToUser(userId:string):Promise<PopulatedFromFriendRequest[]> {
    
    return await client.query(
        q.Let(
            {
                'requests': q.Select(['data'], q.Map(q.Paginate(q.Match(q.Index('friendRequests_by_to'), userId), {size: 100}), (ref) => q.Get(ref)))
            },
            q.Map(q.Var('requests'), q.Lambda('request', (
                {
                    ref: q.Select(['ref'], q.Var('request')),
                    data: {
                        to: userId,
                        from: q.Get(q.Ref(q.Collection('users'), q.Select(['data', 'from'], q.Var('request')))),
                        timeSent: q.Select(['data', 'timeSent'], q.Var('request'))
                    }
                }
            )))
        )
    )
}

export async function getFromOfFriendRequestsToUser(id:string):Promise<{data: string[]}> {

    return await client.query(
        q.Paginate(q.Match(q.Index('friendRequests_by_to_w_from'), id))
    )
}

export async function deleteFriendRequest(id:string) {

    await client.query(
        q.Delete(q.Ref(q.Collection('friendRequests'), id))
    )
}
