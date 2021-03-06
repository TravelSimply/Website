import {query as q} from 'faunadb'
import client from '../fauna'
import { ContactInfo, TravelGroupJoinRequest, TravelGroupJoinRequestWithFromPopulated } from '../interfaces'
import { getUserContactInfoInnerQuery } from './contactInfo'
import { addTravelGroupNotificationQuery } from './travelGroupNotifications'

export async function getTravelGroupJoinRequests(travelGroupId:string):Promise<{data: TravelGroupJoinRequest[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupJoinRequests_by_travelGroup'), travelGroupId)), q.Lambda('ref',
            q.Get(q.Var('ref')) 
        ))
    )
}

export async function getTravelGroupJoinRequestsWithFromPopulated(travelGroupId:string):Promise<{data: TravelGroupJoinRequestWithFromPopulated[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupJoinRequests_by_travelGroup'), travelGroupId)), q.Lambda(
            'ref',
            q.Let(
                {
                    request: q.Get(q.Var('ref'))
                },
                {
                    ref: q.Select('ref', q.Var('request')),
                    data: {
                        travelGroup: q.Select(['data', 'travelGroup'], q.Var('request')),
                        timeSent: q.Select(['data', 'timeSent'], q.Var('request')),
                        from: q.Get(q.Ref(q.Collection('users'), q.Select(['data', 'from'], q.Var('request'))))
                    }
                }
            )
        ))
    )
}

export async function sendJoinRequest(travelGroupId:string, fromId:string) {

    await client.query(
        q.Do(
            q.Create(
                q.Collection('travelGroupJoinRequests'),
                {data: {
                    travelGroup: travelGroupId,
                    from: fromId,
                    timeSent: q.Now()
                }}
            ),
            q.Update(
                q.Ref(q.Collection('travelGroups'), travelGroupId),
                {data: {lastUpdated: q.Now()}}
            ),
        )
    )
}

export async function acceptJoinRequestAndGetTravellerContactInfo(requestId:string, travellerId:string, 
    travelGroupId:string, travellerUsername:string):Promise<ContactInfo> {

    const update = {
        time: q.Now(),
        type: 'acceptJoinRequest',
        users: [travellerUsername]
    }

    return await client.query(
        q.Do(
            q.Delete(q.Ref(q.Collection('travelGroupJoinRequests'), requestId)),
            q.Let(
                {
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), travelGroupId)),
                    contactInfo: getUserContactInfoInnerQuery(travellerId)
                },
                q.Do(
                    q.If(
                        q.IsNonEmpty(q.Intersection([travellerId], q.Select(['data', 'members'], q.Var('travelGroup')))),
                        null,
                        q.Update(q.Ref(q.Collection('travelGroups'), travelGroupId), {
                            data: {
                                members: q.Append(travellerId, q.Select(['data', 'members'], q.Var('travelGroup')))
                            }
                        })
                    ),
                    addTravelGroupNotificationQuery(q.Select(['ref', 'id'], q.Var('travelGroup')), update),
                    q.Var('contactInfo')
                )
            ),
        )
    )
}

export async function rejectJoinRequest(requestId:string, travellerUsername:string, travelGroupId:string) {

    const update = {
        time: q.Now(),
        type: 'rejectJoinRequest',
        users: [travellerUsername]
    }

    await client.query(
        q.Do(
            q.Delete(q.Ref(q.Collection('travelGroupJoinRequests'), requestId)),
            addTravelGroupNotificationQuery(travelGroupId, update)
        )
    )
}