import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupInvitation, TravelGroupInvitationWithSenderInfo, TravelGroupInvitationWithToPopulated } from '../interfaces'
import { addTravelGroupNotificationQuery, getTravelGroupNotificationsInnerQuery } from './travelGroupNotifications'
import { addBasicNotificationQuery } from './userNotifications'

export async function getTravelGroupInvitations(travelGroupId:string):Promise<{data: TravelGroupInvitation[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupInvitations_by_travelGroup'), travelGroupId)), q.Lambda(
            'ref',
            q.Get(q.Var('ref'))
        ))
    )
}

export async function getTravelGroupInvitationsWithToPopulated(travelGroupId:string):Promise<{data: TravelGroupInvitationWithToPopulated[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupInvitations_by_travelGroup'), travelGroupId)), q.Lambda(
            'ref',
            q.Let(
                {
                    invite: q.Get(q.Var('ref'))
                },
                {
                    ref: q.Select('ref', q.Var('invite')),
                    data: {
                        from: q.Select(['data', 'from'], q.Var('invite')),
                        travelGroup: q.Select(['data', 'travelGroup'], q.Var('invite')),
                        timeSent: q.Select(['data', 'timeSent'], q.Var('invite')),
                        to: q.Get(q.Ref(q.Collection('users'), q.Select(['data', 'to'], q.Var('invite'))))
                    }
                }
            )
        ))
    )
}

export async function getUserTravelGroupInvitationsWithSenderInfo(to:string):Promise<{data: TravelGroupInvitationWithSenderInfo[]}> {

    return await client.query(
        q.Map(
            q.Paginate(q.Match(q.Index('travelGroupInvitations_by_to'), to)),
            q.Lambda('ref',
                q.Let(
                    {
                        invite: q.Get(q.Var('ref'))
                    },
                    {
                        ref: q.Select('ref', q.Var('invite')),
                        data: {
                            timeSent: q.Select(['data', 'timeSent'], q.Var('invite')),
                            to: q.Select(['data', 'to'], q.Var('invite')),
                            from: {
                                id: q.Select(['data', 'from'], q.Var('invite')),
                                username: q.Select(['data', 0], q.Paginate(q.Match(
                                    q.Index('users_by_id_w_username'),
                                    q.Select(['data', 'from'], q.Var('invite'))
                                )))
                            },
                            travelGroup: {
                                id: q.Select(['data', 'travelGroup'], q.Var('invite')),
                                info: q.Select(['data', 0], q.Paginate(q.Match(
                                    q.Index('travelGroups_by_id_w_name_and_imageSrc'),
                                    q.Select(['data', 'travelGroup'], q.Var('invite'))
                                )))
                            }
                        }
                    }
                ) 
            )
        )
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
                    to: q.Var('id')
                },
                q.Do(
                    addBasicNotificationQuery('travelGroupInvitations', q.Select(['ref', 'id'], q.Var('invite')), q.Var('to')),
                    q.Update(
                        q.Ref(q.Collection('travelGroups'), travelGroupId),
                        {data: {lastUpdated: q.Now()}}
                    ),
                    q.Var('invite')
                )
            )
        ))
    )
}

export async function rescindInvitation(inviteId:string, toUsername:string, 
    travelGroupId:string):Promise<TravelGroupInvitation> {

    const update = {
        time: q.Now(),
        type: 'rescindInvitation',
        users: [toUsername]
    }

    return await client.query(
        q.Do(
            q.Delete(q.Ref(q.Collection('travelGroupInvitations'), inviteId)),
            addTravelGroupNotificationQuery(travelGroupId, update)
        )
    )
}