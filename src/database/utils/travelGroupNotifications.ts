import {query as q, Expr} from 'faunadb'
import client from '../fauna'
import { TravelGroupNotifications } from '../interfaces'

export function getTravelGroupNotificationsInnerQuery(travelGroupId:string|Expr) {
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

export function addTravelGroupNotificationQuery(travelGroupId:string|Expr, update:TravelGroupNotifications['data']['notifications'][0]) {

    return q.Let(
        {
            notifications: getTravelGroupNotificationsInnerQuery(travelGroupId),
        },
        q.Update(
            q.Select('ref', q.Var('notifications')),
            {data: {
                notifications: q.If(
                    q.GT(q.Count(q.Select(['data', 'notifications'], q.Var('notifications'))), 50),
                    q.Drop(1,
                        q.Append(
                            [update],
                            q.Select(['data', 'notifications'], q.Var('notifications')),
                        )
                    ),
                    q.Append(
                        [update],
                        q.Select(['data', 'notifications'], q.Var('notifications')),
                    )
                )
            }}
        )
    )
}