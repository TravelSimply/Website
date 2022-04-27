import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupJoinRequest, TravelGroupJoinRequestWithFromPopulated } from '../interfaces'

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