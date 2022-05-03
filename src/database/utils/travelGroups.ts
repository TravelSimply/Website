import {query as q} from 'faunadb'
import client from '../fauna'
import { ClientTravelGroupData, TravelGroup, TravelGroupProposal, TravelGroupStringDates, TravelGroupWithPopulatedTravellersAndContactInfo, User, UserWithContactInfo } from '../interfaces'
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