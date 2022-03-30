import {query as q} from 'faunadb'
import client from '../database/fauna'

export async function createFriendRequests(to:string[], from:string) {

    await client.query(
        q.Map(to, q.Lambda('email', q.Create(q.Collection('friendRequests'), {data: {from, to: q.Var('email'), timeSent: q.Now()}})))
    ) 
}