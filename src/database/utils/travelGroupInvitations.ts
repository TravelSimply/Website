import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupInvitation } from '../interfaces'

export async function getTravelGroupInvitations(travelGroupId:string):Promise<{data: TravelGroupInvitation[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupInvitations_by_travelGroup'), travelGroupId)), q.Lambda(
            'ref',
            q.Get(q.Var('ref'))
        ))
    )
}