import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupProposal } from '../interfaces'

export async function createProposal(data:TravelGroupProposal['data'], userJunkIds?:string[]) {

    return await client.query(
        q.Do(
            q.If(
                q.IsArray(userJunkIds || null),
                q.Update(
                    q.Ref(q.Collection('users'), data.by),
                    {data: {junkImagePublicIds: userJunkIds}}
                ),
                null
            ),
            q.Create(
                q.Collection('travelGroupProposals'),
                {data}
            ),
            q.Update(
                q.Ref(q.Collection('travelGroups'), data.travelGroup),
                {data: {lastUpdated: q.Now()}}
            ),
            // update user notifications
        )
    )
}