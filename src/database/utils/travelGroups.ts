import dayjs from 'dayjs'
import {Expr, query as q} from 'faunadb'
import { Filters } from '../../components/travel-groups/find/Search'
import client from '../fauna'
import { ClientTravelGroupData, Ref, TravelGroup, TravelGroupNotifications, TravelGroupProposal, TravelGroupStringDates, TravelGroupWithPopulatedTravellersAndContactInfo, User, UserWithContactInfo } from '../interfaces'
import { addTravelGroupNotificationQuery } from './travelGroupNotifications'
import { populateUserWithContactInfo } from './users'

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

function insertData(d:string) {
    return q.Select(['data', d], q.Var('travelGroup'))
}

function dataWithStringDates() {

    return {
        owner: insertData('owner'),
        members: insertData('members'),
        name: insertData('name'),
        desc: insertData('desc'),
        destination: insertData('destination'),
        settings: insertData('settings'),
        date: {
            unknown: q.Select(['data', 'date', 'unknown'], q.Var('travelGroup')),
            roughly: q.Select(['data', 'date', 'roughly'], q.Var('travelGroup')),
            estLength: q.Select(['data', 'date', 'estLength'], q.Var('travelGroup')),
            start: q.ToString(q.Select(['data', 'date', 'start'], q.Var('travelGroup'))),
            end: q.ToString(q.Select(['data', 'date', 'end'], q.Var('travelGroup')))
        },
        image: q.If(
            q.ContainsField('image', q.Select('data', q.Var('travelGroup'))),
            insertData('image'),
            null
        ),
        lastUpdated: q.If(
            q.ContainsField('lastUpdated', q.Select('data', q.Var('travelGroup'))),
            insertData('lastUpdated'),
            null
        )
    }
}

export async function getUserTravelGroups(userId:string):Promise<{data: TravelGroupStringDates[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroups_by_members'), userId)), q.Lambda('ref',
            q.Let(
                {
                    travelGroup: q.Get(q.Var('ref'))
                },
                {
                    ref: q.Select('ref', q.Var('travelGroup')),
                    data: dataWithStringDates()
                }
            ) 
        ))
    ) 
}

export async function getTravelGroup(id:string):Promise<TravelGroupStringDates> {

    return await client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('travelGroups'), id)),
            q.Let(
                {
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), id))
                },
                {
                    ref: q.Select('ref', q.Var('travelGroup')),
                    data: dataWithStringDates()
                }    
            ),
            null
        )
    )
}

// Return 0 if the user is not in the travel group
export async function getTravelGroupWithPopulatedTravellersAndContactInfo(id:string, 
    currUser:User):Promise<TravelGroupWithPopulatedTravellersAndContactInfo | 0> {

    return await client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('travelGroups'), id)),
            q.Let(
                {
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), id))
                },
                q.If(
                    q.Not(q.ContainsValue(currUser.ref.id, q.Select(['data', 'members'], q.Var('travelGroup')))),
                    0, // The user is not in the travel group
                    {
                        ref: q.Select('ref', q.Var('travelGroup')),
                        data: {
                            ...dataWithStringDates(),
                            members: q.Map(q.Select(['data', 'members'], q.Var('travelGroup')), q.Lambda(
                                'member',
                                q.If(
                                    q.Equals(currUser.ref.id, q.Var('member')),
                                    q.Let(
                                        {
                                            user: currUser
                                        },
                                        populateUserWithContactInfo()
                                    ),
                                    q.If(
                                        q.Exists(q.Ref(q.Collection('users'), q.Var('member'))),
                                        q.Let(
                                            {
                                                user: q.Get(q.Ref(q.Collection('users'), q.Var('member')))
                                            },
                                            populateUserWithContactInfo()
                                        ),
                                        null
                                    )
                                )
                            ))
                        }
                    }
                )
            ),
            null
        )
    )
}

export async function getTravelGroupMembersWithContactInfo(id:string):Promise<UserWithContactInfo[]> {
    
    return await client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('travelGroups'), id)),
            q.Let(
                {
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), id))
                },
                q.Map(q.Select(['data', 'members'], q.Var('travelGroup')), q.Lambda(
                    'member',
                    q.If(
                        q.Exists(q.Ref(q.Collection('users'), q.Var('member'))),
                        q.Let(
                            {
                                user: q.Get(q.Ref(q.Collection('users'), q.Var('member')))
                            },
                            populateUserWithContactInfo()
                        ),
                        null
                    )
                ))
            ),
            null
        )
    )
}

export async function getTravelGroupOwner(id:string):Promise<{data: string[]}> {

    return await client.query(
        q.Paginate(q.Match(q.Index('travelGroups_by_id_w_owner'), id))
    )
}

export async function getTravelGroupPreview(travelGroupId:string, userId:string):Promise<{
    travelGroup: 0 | TravelGroup;
    invites: Ref[];
    joinRequests: Ref[];
}> {

    return await client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('travelGroups'), travelGroupId)),
            q.Let(
                {
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), travelGroupId))
                },
                q.Let(
                    {
                        travelGroup: {
                            ref: q.Select('ref', q.Var('travelGroup')),
                            data: dataWithStringDates()
                        }
                    },
                    q.If(
                        q.ContainsValue(userId, q.Select(['data', 'members'], q.Var('travelGroup'))),
                        {
                            travelGroup: q.Var('travelGroup'),
                            invites: [],
                            joinRequests: []
                        },
                        q.Let(
                            {
                                travelGroup: q.Var('travelGroup'),
                                invites: q.Select('data', q.Paginate(q.Match(q.Index('travelGroupInvitations_by_to_and_travelGroup'), 
                                [userId, travelGroupId])))
                            },
                            q.If(
                                q.GT(q.Count(q.Var('invites')), 0),
                                {
                                    travelGroup: q.Var('travelGroup'),
                                    invites: q.Var('invites'),
                                    joinRequests: []
                                },
                                q.If(
                                    q.Equals('public', q.Select(['data', 'settings', 'mode'], q.Var('travelGroup'))),
                                    q.Let(
                                        {
                                            travelGroup: q.Var('travelGroup'),
                                            joinRequests: q.Select('data', q.Paginate(q.Match(
                                                q.Index('travelGroupJoinRequests_by_from_and_travelGroup'),
                                                [userId, travelGroupId]
                                            )))
                                        },
                                        {
                                            travelGroup: q.Var('travelGroup'),
                                            invites: [],
                                            joinRequests: q.Var('joinRequests')
                                        }
                                    ),
                                    {
                                        travelGroup: 0,
                                        invites: [],
                                        joinRequests: []
                                    }
                                )
                            )
                        )
                    )
                )
            ),
            {
                travelGroup: null,
                invites: [],
                joinRequests: []
            }
        )
    )
}

export async function getFriendsTravelGroupsBareInfo(userId:string) {

    return await client.query(
        q.Let(
            {
                friends: q.Select(['data', 'friends'], q.Get(q.Ref(q.Collection('users'), userId)))
            },
            q.Filter(q.Union(
                q.Map(q.Var('friends'), q.Lambda('friend',
                    q.Select('data', q.Paginate(
                        q.Match(q.Index('travelGroups_by_members_w_privacy_and_startDate_and_unknown_and_id'), q.Var('friend'))),
                        {size: 20}
                    )
                ))
            ), q.Lambda('info', 
                q.And(
                    q.Equals('public', q.Select(0, q.Var('info'))),
                    q.Or(
                        q.Select(2, q.Var('info')),
                        q.GT(
                            q.TimeDiff(q.Date(dayjs().format('YYYY-MM-DD')), q.Select(1, q.Var('info')) , 'day'),
                        0))
                    ),
                )
            )
        )
    )
}

function travelGroupPassesSearch(travelGroup:Expr, search:string) {

    if (!search) return true

    return q.Or(
        q.ContainsStr(q.LowerCase(q.Select(['data', 'name'], travelGroup)), search),
        q.ContainsStr(q.LowerCase(q.Select(['data', 'destination', 'combo'], travelGroup)), search)
    )
}

function travelGroupPassesFilters(travelGroup:Expr, filters:Filters) {

    return q.And(
        travelGroupPassesSearch(travelGroup, filters.search)
    )
}

function constainsSearchQuery(userId:string, filters:Filters, travelGroupIds:string[], maxFinds:number) {

    return q.Reduce(q.Lambda(['total', 'id'],
        q.If(
            q.And(
                q.LT(q.Select('count', q.Var('total')), maxFinds),
                q.Exists(q.Ref(q.Collection('travelGroups'), q.Var('id'))),
            ),
            q.Let(
                {
                    total: q.Var('total'),
                    travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), q.Var('id')))
                },
                q.If(
                    q.And(
                        q.Not(q.ContainsValue(userId, q.Select(['data', 'members'], q.Var('travelGroup')))),
                        travelGroupPassesFilters(q.Var('travelGroup'), filters),
                    ),
                    {
                        count: q.Add(q.Select('count', q.Var('total')), 1),
                        items: appendMatchingTravelGroupToTotal({
                            ref: q.Select('ref', q.Var('travelGroup')),
                            data: dataWithStringDates()
                        } as any, q.Var('total'))
                    },
                    {
                        count: q.Select('count', q.Var('total')),
                        items: appendNotMatchingTravelGroupToTotal({
                            ref: q.Select('ref', q.Var('travelGroup')),
                            data: dataWithStringDates()
                        } as any, q.Var('total'))
                    }
                )
            ),
            q.Var('total')
        )
    ),
    {
        items: [],
        count: 0
    },
    travelGroupIds
    )
}

function comboMatches(combo:Expr, filters:Filters) {
    if (filters.destinationCity) {
        return q.ContainsStr(combo, filters.destinationCity)
    }
    if (filters.destinationState) {
        return q.ContainsStr(combo, filters.destinationState)
    }
    if (filters.destinationCountry) {
        return q.ContainsStr(combo, filters.destinationCountry)
    }
    return q.ContainsStr(combo, filters.destinationRegion || '')
}

function containsDestinationQuery(userId:string, filters:Filters, travelGroupIds:string[], maxFinds:number) {

    return q.Reduce(q.Lambda(['total', 'id'], 
        q.If(
            q.And(
                q.LT(q.Select('count', q.Var('total')), maxFinds),
                q.Exists(q.Ref(q.Collection('travelGroups'), q.Var('id'))),
            ),
            q.Let(
                {
                    id: q.Var('id'),
                    total: q.Var('total'),
                    combo: q.LowerCase(q.Select(['data', 0], q.Paginate(q.Match(q.Index('travelGroups_by_id_w_destinationCombo'), q.Var('id')))))
                },
                q.If(
                    comboMatches(q.Var('combo'), filters),
                    q.Let(
                        {
                            total: q.Var('total'),
                            travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), q.Var('id')))
                        },
                        q.If(
                            q.And(
                                q.Not(q.ContainsValue(userId, q.Select(['data', 'members'], q.Var('travelGroup')))),
                                travelGroupPassesFilters(q.Var('travelGroup'), filters),
                            ),
                            {
                                count: q.Add(q.Select('count', q.Var('total')), 1),
                                items: appendMatchingTravelGroupToTotal({
                                    ref: q.Select('ref', q.Var('travelGroup')),
                                    data: dataWithStringDates()
                                } as any, q.Var('total'))
                            },
                            {
                                count: q.Select('count', q.Var('total')),
                                items: appendNotMatchingTravelGroupToTotal({
                                    ref: q.Select('ref', q.Var('travelGroup')),
                                    data: dataWithStringDates()
                                } as any, q.Var('total'))
                            }
                        )
                    ),
                    q.Var('total')
                )
            ),
            q.Var('total')
        )
    ),
    {
        items: [],
        count: 0
    },
    travelGroupIds
    )
}

function appendMatchingTravelGroupToTotal(travelGroup:Expr, total:Expr) {
    return q.Append({
        match: true,
        travelGroup
    }, q.Select('items', total))
}

function appendNotMatchingTravelGroupToTotal(travelGroup:Expr, total:Expr) {
    return q.Append({
        match: false,
        travelGroup
    }, q.Select('items', total))
}

export async function searchForTravelGroup(userId:string, filters:Filters, travelGroupIds:string[],
    maxFinds:number) {

    return await client.query(
        q.If(
            Boolean(filters.destinationCity) || Boolean(filters.destinationCountry) ||
            Boolean(filters.destinationRegion) || Boolean(filters.destinationState),
            containsDestinationQuery(userId, filters, travelGroupIds, maxFinds),
            constainsSearchQuery(userId, filters, travelGroupIds, maxFinds),
        )
    )
}

export async function updateTravelGroupWithOwnerCheck(id:string, userId:string, 
    data:TravelGroupProposal['data']['data'], userJunkIds?:string[]) {

    if (data.date) {
        data.date.start = q.Date(data.date.start)
        data.date.end = q.Date(data.date.end)
    }

    await client.query(
        q.If(
            q.Equals(userId, q.Select(['data', 0], q.Paginate(q.Match(q.Index('travelGroups_by_id_w_owner'), id)))),
            q.Do(
                q.If(
                    q.IsArray(userJunkIds || null),
                    q.Update(
                        q.Ref(q.Collection('users'), userId),
                        {data: {junkImagePublicIds: userJunkIds}}
                    ),
                    null
                ),
                q.Update(
                    q.Ref(q.Collection('travelGroups'), id),
                    {data: {...data}}
                )
                // send a notification if we want to
            ),
            null
        )
    )
}

export async function updateMembersWithOwnerCheck(id:string, userId:string, members:string[]) {

    await client.query(
        q.If(
            q.Equals(userId, q.Select(['data', 0], q.Paginate(q.Match(q.Index('travelGroups_by_id_w_owner'), id)))),
            q.Do(
                q.Update(
                    q.Ref(q.Collection('travelGroups'), id),
                    {data: {members}}
                )
                // send a notification
            ),
            null
        )
    )
}

function disbandTravelGroupQuery(id:string) {

    return q.Let(
        {
            invites: q.Paginate(q.Match(q.Index('travelGroupInvitations_by_travelGroup'), id), {size: 1000}),
            requests: q.Paginate(q.Match(q.Index('travelGroupJoinRequests_by_travelGroup'), id), {size: 1000}),
            notifications: q.Paginate(q.Match(q.Index('travelGroupNotifications_by_travelGroup'), id)),
            proposals: q.Paginate(q.Match(q.Index('travelGroupProposals_by_travelGroup'), id), {size: 1000}),
            publicIds: q.Paginate(q.Match(q.Index('travelGroupProposals_by_travelGroup_w_publicId'), id), {size: 1000})
        },
        q.Do(
            q.Map(q.Var('invites'), (ref) => q.Delete(ref)),
            q.Map(q.Var('requests'), (ref) => q.Delete(ref)),
            q.Map(q.Var('notifications'), (ref) => q.Delete(ref)),
            q.Map(q.Var('proposals'), (ref) => q.Delete(ref)),
            q.Delete(q.Ref(q.Collection('travelGroups'), id)),
            q.Var('publicIds')
        )
    )
}

export async function leaveTravelGroup(id:string, userId:string, username:string):Promise<any> {

    const update = {
        time: q.Now(),
        type: 'leave',
        users: [username]
    }

    return await client.query(
        q.Let(
            {
                travelGroup: q.Get(q.Ref(q.Collection('travelGroups'), id))
            },
            q.If(
                q.Equals(1, q.Count(q.Select(['data', 'members'], q.Var('travelGroup')))),
                disbandTravelGroupQuery(id),
                q.Let(
                    {
                        remainingMembers: q.Filter(q.Select(['data', 'members'], q.Var('travelGroup')), q.Lambda(
                            'member',
                            q.Not(q.Equals(userId, q.Var('member')))
                        )),
                        travelGroup: q.Var('travelGroup')
                    },
                    q.Do(
                        q.Update(
                            q.Select('ref', q.Var('travelGroup')),
                            {data: {
                                members: q.Var('remainingMembers'),
                                owner: q.If(
                                    q.Equals(userId, q.Select(['data', 'owner'], q.Var('travelGroup'))),
                                    q.Select(0, q.Var('remainingMembers')),
                                    q.Select(['data', 'owner'], q.Var('travelGroup'))
                                )
                            }}
                        ),
                        addTravelGroupNotificationQuery(id, update)
                    )
                )
            )
        )
    )
}

export async function disbandTravelGroup(id:string):Promise<{data: string[]}> {

    return await client.query(
        disbandTravelGroupQuery(id)
    )
}