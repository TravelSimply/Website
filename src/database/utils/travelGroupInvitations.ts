import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupInvitation } from '../interfaces'
import { addBasicNotification } from './users'

export async function getTravelGroupInvitations(travelGroupId:string):Promise<{data: TravelGroupInvitation[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupInvitations_by_travelGroup'), travelGroupId)), q.Lambda(
            'ref',
            q.Get(q.Var('ref'))
        ))
    )
}

export async function sendInvitationsWithNotificationUpdate(from:string, to:string[], 
    travelGroupId:string):Promise<TravelGroupInvitation[]> {

    return await client.query(
        q.Map(to, q.Lambda('id', 
            q.Let(
                {
                    invite: q.Create(q.Collection('travelGroupInvitations'), {data: {
                        to: q.Var('id'),
                        from,
                        travelGroup: travelGroupId,
                        timeSent: q.Now()
                    }}),
                    to: q.Get(q.Ref(q.Collection('users'), q.Var('id')))
                },
                q.Do(
                    addBasicNotification('travelGroupInvitations', q.Select(['ref', 'id'], q.Var('invite')), q.Var('to')),
                    q.Var('invite')
                )
            )
        ))
    )
}