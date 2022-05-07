import {query as q, Expr} from 'faunadb'
import client from '../fauna'

export function addBasicNotificationQuery(collection:string, id:Expr, user:Expr) {

    return q.If(
        q.Exists(q.Match(q.Index('userNotifications_by_userId'), user)),
        q.Let(
            {
                notifications: q.Get(q.Match(q.Index('userNotifications_by_userId'), user))
            },
            q.Update(
                q.Select('ref', q.Var('notifications')),
                {data: {
                    basic: q.Append(q.Reduce(
                        q.Lambda((filtered, curr) => q.If(
                            q.Or(q.LT(q.Count(filtered), 9), q.Not(q.Select('seen', curr))),
                            q.Append(curr, filtered),
                            filtered
                        )),
                        [],
                        q.Select(['data', 'basic'], q.Var('notifications'))
                    ), [{collection, id, time: q.Now()}])
                }}
            )
        ),
        q.Create(q.Collection('userNotifications'), {data: {
            userId: user,
            travelGroups: [],
            basic: [{collection, id, time: q.Now()}]
        }})
    )
}