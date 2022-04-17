import {query as q} from 'faunadb'
import client from '../fauna'
import { ClientTravelGroupData, TravelGroup, TravelGroupStringDates } from '../interfaces'

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
        }
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