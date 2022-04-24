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

export async function sendInvitationWithNotificationUpdate(from:string, to:string, travelGroupId:string) {

    await client.query(
        q.Let(
            {
                invite: q.Create(q.Collection('travelGroupInvitations'), {data: {
                    to, from,
                    travelGroup: travelGroupId,
                    timeSent: q.Now()
                }}),
                to: q.Get(q.Ref(q.Collection('users'), to))
            },
            addBasicNotification('travelGroupInvitations', q.Select(['ref', 'id'], q.Var('invite')), q.Var('to'))
        )
    )
}