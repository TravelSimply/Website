import {query as q} from 'faunadb'
import client from '../fauna'
import { ContactInfo, TravelGroupJoinRequest, TravelGroupJoinRequestWithFromPopulated } from '../interfaces'
import { getUserContactInfoInnerQuery } from './contactInfo'

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

export async function acceptJoinRequestAndGetTravellerContactInfo(requestId:string, travellerId:string, 
    travelGroupId:string):Promise<ContactInfo> {

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
                    q.Var('contactInfo')
                )
            ),
        )
    )
}

export async function rejectJoinRequest(requestId:string) {

    await client.query(
        q.Delete(q.Ref(q.Collection('travelGroupJoinRequests'), requestId))
    )
}