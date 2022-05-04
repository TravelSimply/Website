import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupProposal } from '../interfaces'

export async function createProposal(data:TravelGroupProposal['data'], userJunkIds?:string[]) {

    if (data.data.date) {
        data.data.date.start = q.Date(data.data.date.start)
        data.data.date.end = q.Date(data.data.date.end)
    }

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

export async function getTravelGroupProposals(travelGroupId:string):Promise<{data: TravelGroupProposal[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupProposals_by_travelGroup'), travelGroupId)) , (ref) => q.Get(ref))
    )
}