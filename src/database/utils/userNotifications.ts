import {query as q, Expr} from 'faunadb'
import client from '../fauna'
import { ClientUserNotifications, UserNotifications } from '../interfaces'

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
                    ), [{seen: false, collection, id, time: q.Now()}])
                }}
            )
        ),
        q.Create(q.Collection('userNotifications'), {data: {
            userId: user,
            travelGroups: [],
            basic: [{seen: false, collection, id, time: q.Now()}]
        }})
    )
}

function getUserNotificationsQuery(userId:string) {

    return q.If(
        q.Exists(q.Match(q.Index('userNotifications_by_userId'), userId)),
        q.Get(q.Match(q.Index('userNotifications_by_userId'), userId)),
        q.Create(q.Collection('userNotifications'), {data: {
            userId,
            travelGroups: [],
            basic: []
        }})
    )
}

function insertBasicInfo(item:Expr) {
    return {
        seen: q.Select('seen', item),
        collection: q.Select('collection', item),
        id: q.Select('id', item),
        time: q.Select('time', item),
    }
}

export async function getPopulatedUserNotificationsWithTravelGroupLastUpdated(userId:string) {

    return await client.query(
        q.Let(
            {
                notifications: getUserNotificationsQuery(userId)
            },
            q.Let(
                {
                    notifications: {
                        ref: q.Select('ref', q.Var('notifications')),
                        data: {
                            userId: q.Select(['data', 'userId'], q.Var('notifications')),
                            travelGroups: q.Select(['data', 'travelGroups'], q.Var('notifications')),
                            basic: q.Map(q.Select(['data', 'basic'], q.Var('notifications')), q.Lambda('item',
                                q.If(
                                    q.Exists(q.Ref(q.Collection(q.Select('collection', q.Var('item'))), q.Select('id', q.Var('item')))),
                                    q.Let(
                                        {
                                            info: {
                                                ...insertBasicInfo(q.Var('item')),
                                                content: q.Get(q.Ref(q.Collection(q.Select('collection', q.Var('item'))), q.Select('id', q.Var('item'))))
                                            }
                                        },
                                        q.If(
                                            q.ContainsField('travelGroup', q.Select(['content', 'data'], q.Var('info'))),
                                            {
                                                ...insertBasicInfo(q.Var('info')),
                                                content: {
                                                    ref: q.Select(['content', 'ref'], q.Var('info')),
                                                    data: q.Select(['content', 'data'], q.Var('info')),
                                                    travelGroupName: q.Select('data', q.Paginate(q.Match(
                                                        q.Index('travelGroups_by_id_w_name'),
                                                        q.Select(['content', 'data', 'travelGroup'], q.Var('info'))
                                                    )))
                                                }
                                            },
                                            q.Var('info')
                                        )
                                    ),
                                    q.Var('item')
                                )
                            ))
                        }
                    },
                    travelGroups: q.Filter(q.Map(q.Select(['data', 'travelGroups'], q.Var('notifications')), q.Lambda(
                        'group',
                        q.If(
                            q.Exists(q.Match(q.Index('travelGroups_by_id_w_lastUpdated'), q.Select('id', q.Var('group')))),
                            q.Select(['data', 0], q.Paginate(q.Match(q.Index('travelGroups_by_id_w_lastUpdated'), q.Select('id', q.Var('group'))))),
                            null
                        )
                    )), q.Lambda(
                        'group',
                        q.Not(q.IsNull(q.Var('group')))
                    ))
                },
                q.Let(
                    {
                        notifications: q.Var('notifications'),
                        travelGroups: q.Var('travelGroups'),
                        travelGroupIds: q.Map(q.Var('travelGroups'), q.Lambda('group', q.Select(0, q.Var('group')))) 
                    },
                    q.Do(
                        q.If(
                            q.Equals(
                                q.Count(q.Select(['data', 'travelGroups'], q.Var('notifications'))),
                                q.Count(q.Var('travelGroups'))
                            ),
                            null,
                            q.Update(
                                q.Select('ref', q.Var('notifications')),
                                {data: {
                                    travelGroups: q.Filter(q.Select(['data', 'travelGroups'], q.Var('notifications')), q.Lambda(
                                        'group',
                                        q.ContainsValue(q.Select('id', q.Var('group')), q.Var('travelGroupIds'))
                                    ))
                                }}
                            )
                        ),
                        {
                            notifications: q.Var('notifications'),
                            travelGroups: q.Var('travelGroups')
                        }
                    )
                )
            )
        )
    )
}

export async function addTravelGroups(id:string, travelGroups:ClientUserNotifications['data']['travelGroups']) {

    const timeTravelGroups = travelGroups.map(group => {
        if (group.lastUpdated) {
            return {...group, lastUpdated: q.Time(group.lastUpdated['@ts'])}
        } else {
            return {...group, lastUpdated: q.Now()}
        }
    })

    return await client.query(
        q.Update(
            q.Ref(q.Collection('userNotifications'), id),
            {data: {travelGroups: timeTravelGroups}}
        )
    )
}

export async function markAllAsViewed(id:string, basic:ClientUserNotifications['data']['basic'], 
    travelGroups:ClientUserNotifications['data']['travelGroups']) {

    const basicUpdated = basic.map(n => ({
        ...n,
        seen: true,
        time: q.Time(n.time['@ts'])
    }))

    const travelGroupsUpdated = travelGroups.map(g => ({
        ...g,
        lastUpdated: q.Now()
    }))

    await client.query(
        q.Update(
            q.Ref(q.Collection('userNotifications'), id),
            {data: {
                basic: basicUpdated, 
                travelGroups: travelGroupsUpdated
            }}
        )
    ) 
}