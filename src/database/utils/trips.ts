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