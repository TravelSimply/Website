import { ClientTrip, Trip } from "../interfaces";
import {query as q} from 'faunadb'
import client from '../fauna'

export async function createTrip(tripData:ClientTrip['data']):Promise<Trip>  {

    const data = {...tripData, date: {
        start: q.Date(tripData.date.start['@date']),
        end: q.Date(tripData.date.end['@date']),
        unknown: tripData.date.unknown
    }}

    return await client.query(
        q.Create(q.Collection('trips'), {data})
    )
}

export async function getTravelGroupTrips(travelGroupId:string):Promise<{data: Trip[]}> {

    return await client.query(
        q.Map(
            q.Paginate(q.Match(q.Index('trips_by_travelGroup'), travelGroupId)),
            q.Lambda('ref', q.Get(q.Var('ref')))
        )
    )
}

export async function getTripWithTravelGroupNameAndMembers(travelGroupId:string, tripId:string) {

    const info:{trip:Trip, travelGroupInfo:{data:[string,string][]}} = await client.query(
        {
            travelGroupInfo: q.Paginate(q.Match(q.Index('travelGroups_by_id_w_name_and_members'), travelGroupId)),
            trip: q.Get(q.Ref(q.Collection('trips'), tripId))
        }
    )

    return {
        ...info.trip,
        data: {
            ...info.trip.data,
            travelGroup: {
                id: info.trip.data.travelGroup,
                name: info.travelGroupInfo.data[0][0],
                members: info.travelGroupInfo.data.map(d => d[1])
            }
        }
    }
}

export async function joinTrip(tripId:string, userId:string) {

    await client.query(
        q.Let(
            {
                members: q.Select('data', q.Paginate(q.Match(q.Index('trips_by_id_w_members'), tripId)))
            },
            q.Update(
                q.Ref(q.Collection('trips'), tripId),
                {
                    data: {
                        members: q.Append(
                            userId,
                            q.Var('members')
                        )
                    }
                }
            )
        )
    )
}