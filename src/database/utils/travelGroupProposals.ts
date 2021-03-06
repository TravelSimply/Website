import {query as q, Expr} from 'faunadb'
import client from '../fauna'
import { TravelGroupProposal } from '../interfaces'
import { addTravelGroupNotificationQuery } from './travelGroupNotifications'

export async function createProposal(data:TravelGroupProposal['data'], 
    userJunkIds?:string[]):Promise<TravelGroupProposal> {

    if (data.data.date) {
        data.data.date.start = q.Date(data.data.date.start)
        data.data.date.end = q.Date(data.data.date.end)
    }

    return await client.query(
        q.Do(
            q.If(
                q.IsArray(userJunkIds || null),
                q.Update(
                    q.Ref(q.Collection('users'), data.by),
                    {data: {junkImagePublicIds: userJunkIds}}
                ),
                null
            ),
            q.Update(
                q.Ref(q.Collection('travelGroups'), data.travelGroup),
                {data: {lastUpdated: q.Now()}}
            ),
            q.Let(
                {
                    proposal: q.Create(
                        q.Collection('travelGroupProposals'),
                        {data: {...data, timeSent: q.Now()}}
                    )
                },
                {
                    ref: q.Select('ref', q.Var('proposal')),
                    data: proposalDataWithStringDates(q.Var('proposal'))
                }
            )
            // update user notifications
        )
    )
}

function insertData(prop:string, proposal:Expr) {
    return q.If(
        q.ContainsField(prop, q.Select(['data', 'data'], proposal)),
        q.Select(['data', 'data', prop], proposal),
        null
    )
}

function proposalDataWithStringDates(proposal:Expr) {
    return {
        travelGroup: q.Select(['data', 'travelGroup'], proposal),
        by: q.Select(['data', 'by'], proposal),
        type: q.Select(['data', 'type'], proposal),
        for: q.Select(['data', 'for'], proposal),
        against: q.Select(['data', 'against'], proposal),
        data: {
            name: insertData('name', proposal),
            desc: insertData('desc', proposal),
            destination: insertData('destination', proposal),
            image: insertData('image', proposal),
            date: q.If(
                q.ContainsField('date', q.Select(['data', 'data'], proposal)),
                {
                    start: q.ToString(q.Select(['data', 'data', 'date', 'start'], proposal)),
                    end: q.ToString(q.Select(['data', 'data', 'date', 'end'], proposal))
                },
                null
            )
        },
        timeSent: q.Select(['data', 'timeSent'], proposal)
    }
}

export async function getTravelGroupProposals(travelGroupId:string):Promise<{data: TravelGroupProposal[]}> {

    return await client.query(
        q.Map(q.Paginate(q.Match(q.Index('travelGroupProposals_by_travelGroup'), travelGroupId)) , q.Lambda(
            'ref',
            q.Let(
                {
                    proposal: q.Get(q.Var('ref'))
                },
                {
                    ref: q.Select('ref', q.Var('proposal')),
                    data: proposalDataWithStringDates(q.Var('proposal'))
                }
            )
        ))
    )
}

function voteInnerQuery(id:string, userId:string, type:string) {

    return q.Let(
        {
            type: q.Select(['data'], q.Paginate(q.Match(q.Index(`travelGroupProposals_by_id_w_${type}`), id)))
        },
        q.If(
            q.ContainsValue(userId, q.Var('type')),
            null,
            q.Update(
                q.Ref(q.Collection('travelGroupProposals'), id),
                {data: {
                    [type]: q.Append(userId, q.Var('type'))
                }}
            )
        )
    )
}

function removeVoteInnerQuery(id:string, userId:string, type:string) {

    return q.Let(
        {
            type: q.Select(['data'], q.Paginate(q.Match(q.Index(`travelGroupProposals_by_id_w_${type}`), id)))
        },
        q.If(
            q.ContainsValue(userId, q.Var('type')),
            q.Update(
                q.Ref(q.Collection('travelGroupProposals'), id),
                {data: {
                    [type]: q.Filter(q.Var('type'), q.Lambda('id', q.Not(q.Equals(q.Var('id'), userId))))
                }}
            ),
            null
        )
    )
}

export async function voteForProposal(id:string, userId:string) {

    return await client.query(
        q.Do(
            voteInnerQuery(id, userId, 'for'),
            removeVoteInnerQuery(id, userId, 'against')
        )
    )
}

export async function voteAgainstProposal(id:string, userId:string) {

    return await client.query(
        q.Do(
            voteInnerQuery(id, userId, 'against'),
            removeVoteInnerQuery(id, userId, 'for')
        )
    )
}

export async function cancelProposalVote(id:string, userId:string, type:string) {
    
    return await client.query(
        removeVoteInnerQuery(id, userId, type)
    )
}

export async function acceptProposal(id:string, travelGroupId:string, proposalUserUsername:string, 
    data:TravelGroupProposal['data']['data']) {

    const filteredData:any = {}
    if (data.date) {
        filteredData.date = {
            ...data.date,
            unknown: false,
            roughly: false
        }
    }
    if (data.desc) filteredData.desc = data.desc
    if (data.destination) filteredData.destination = data.destination
    if (data.image) filteredData.image = data.image
    if (data.name) filteredData.name = data.name

    const update = {
        time: q.Now(),
        type: 'acceptProposal',
        users: [proposalUserUsername]
    }

    return await client.query(
        q.Do(
            q.Update(
                q.Ref(q.Collection('travelGroups'), travelGroupId),
                {data: filteredData}
            ),
            q.Delete(q.Ref(q.Collection('travelGroupProposals'), id)),
            addTravelGroupNotificationQuery(travelGroupId, update)
        )
    )
}

export async function rejectProposal(id:string, travelGroupId:string, proposalUserUsername:string) {

    const update = {
        time: q.Now(),
        type: 'rejectProposal',
        users: [proposalUserUsername]
    }

    return await client.query(
        q.Do(
            q.Delete(q.Ref(q.Collection('travelGroupProposals'), id)),
            addTravelGroupNotificationQuery(travelGroupId, update)
        )
    )
}