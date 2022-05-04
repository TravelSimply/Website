import {query as q} from 'faunadb'
import client from '../fauna'
import { TravelGroupNotifications } from '../interfaces'

function getTravelGroupNotificationsInnerQuery(travelGroupId:string) {
    return q.If(
        q.Exists(q.Match(q.Index('travelGroupNotifications_by_travelGroup'), travelGroupId)),
        q.Get(q.Match(q.Index('travelGroupNotifications_by_travelGroup'), travelGroupId)),
        q.Create(q.Collection('travelGroupNotifications'), {data: {
            travelGroup: travelGroupId,
            notifications: []
        }})
    )
}

export async function getTravelGroupNotifications(travelGroupId:string):Promise<TravelGroupNotifications> {

    return await client.query(
        getTravelGroupNotificationsInnerQuery(travelGroupId)
    )
}