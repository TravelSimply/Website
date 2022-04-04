import {query as q} from 'faunadb'
import client from '../fauna'
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

function appendFriend(id:string) {

    return {data: {friends: q.If(
        q.ContainsField('friends', q.Select(['data'], q.Var('user'))),
        q.Append(id, q.Select(['data', 'friends'], q.Var('user'))),
        [id]
    )}}
}

export async function addFriend(a:string, b:string, friendRequestId:string) {

    await client.query(
        q.Do(
            q.Map([q.Ref(q.Collection('users'), a), q.Ref(q.Collection('users'), b)], q.Lambda('ref',
                q.Let(
                    {'user': q.Get(q.Var('ref'))},
                    q.Update(
                        q.Select('ref', q.Var('user')),
                        q.If(
                            q.Equals(q.Select(['ref', 'id'], q.Var('user')), a),
                            appendFriend(b),
                            appendFriend(a)
                        )
                    )
                )
            )),
            q.Delete(q.Ref(q.Collection('friendRequests'), friendRequestId)) 
        )
    )
}

function removeIdFromFriendList(id:string) {

    return {data: {friends: q.If(
        q.ContainsField('friends', q.Select(['data'], q.Var('user'))),
        q.Filter(q.Select(['data', 'friends'], q.Var('user')), q.Lambda('friendId', q.Not(q.Equals(q.Var('friendId'), id)))),
        []
    )}}
}

export async function removeFriend(a:string, b:string) {

    await client.query(
        q.Map([q.Ref(q.Collection('users'), a), q.Ref(q.Collection('users'), b)], q.Lambda('ref', 
            q.Let(
                {'user': q.Get(q.Var('ref'))},
                q.Update(
                    q.Select('ref', q.Var('user')),
                    q.If(
                        q.Equals(q.Select(['ref', 'id'], q.Var('user')), a),
                        removeIdFromFriendList(b),
                        removeIdFromFriendList(a) 
                    )
                )
            ) 
        ))
    )
}