import {query as q} from 'faunadb'
import client from '../fauna'
import { ClientTravelGroupData, TravelGroup } from '../interfaces'

export async function getUserTravelGroupDates(userId:string):Promise<{data: [string, string][]}> {

    return await client.query(
        q.Paginate(q.Match(q.Index('travelGroups_by_members_w_date'), userId))
    )
}

export async function createTravelGroup(data:ClientTravelGroupData):Promise<TravelGroup> {

    const dbData = {...data, date: {
        ...data.date,
        start: q.Date(data.date.start),
        end: q.Date(data.date.end)
    }}

    return await client.query(
        q.Create(q.Collection('travelGroups'), {data: dbData})
    )
}