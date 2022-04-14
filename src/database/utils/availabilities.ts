import dayjs from 'dayjs'
import {Expr, query as q} from 'faunadb'
import client from '../fauna'
import { Availability} from '../interfaces'

export async function getAvailabilityOfUser(userId:string):Promise<Availability> {

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('availabilities_by_userId'), userId)),
            q.Get(q.Match(q.Index('availabilities_by_userId'), userId)),
            null
        )
    )
}

interface PopulateAvailabilityProps {
    availability: Availability;
    travelGroups: {data: [string, string, boolean, boolean][]};
}

export function populateAvailability(info:PopulateAvailabilityProps) {

    if (!info) {
        return null
    }

    const {availability, travelGroups} = info

    for (const range of travelGroups.data) {
        if (range[2] || range[3]) {
            continue
        }
        const start = dayjs(range[0])
        const end = dayjs(range[1])
        let currDate = start
        while (currDate.isBefore(end) || currDate.isSame(end, 'day')) {
            const year = currDate.format('YYYY')
            if (!availability.data.dates[year]) {
                availability.data.dates[year] = {
                    unavailable: [],
                    available: []
                }
            }
            if (!availability.data.dates[year].travelling) {
                availability.data.dates[year].travelling = []
            }
            availability.data.dates[year].travelling.push(
                currDate.format('MM') + currDate.format('DD')
            )
            currDate = currDate.add(1, 'day')
        }
    }

    return availability
}

export async function getAvailabilityAndTravelGroupsOfUser(userId:string):Promise<PopulateAvailabilityProps> {

    return await client.query(
        q.Let(
            {
                availability: q.If(
                    q.Exists(q.Match(q.Index('availabilities_by_userId'), userId)),
                    q.Get(q.Match(q.Index('availabilities_by_userId'), userId)),
                    q.Create(q.Collection('availabilities'), {data: {userId, dates: {}}})
                ),
                travelGroups: q.Paginate(q.Match(q.Index('travelGroups_by_members_w_date_and_type'), userId))
            },
            {
                availability: q.Var('availability'),
                travelGroups: q.Map(q.Var('travelGroups'), q.Lambda(
                    'travelDates',
                    [
                        q.ToString(q.Select(0, q.Var('travelDates'))),
                        q.ToString(q.Select(1, q.Var('travelDates'))),
                        q.Select(2, q.Var('travelDates')),
                        q.Select(3, q.Var('travelDates'))
                    ]
                ))
            }
        )
    )
}

export async function createAvailability(userId:string):Promise<Availability> {

    return await client.query(
        q.Create(q.Collection('availabilities'), {data: {userId, dates: {}}})
    )
}

export async function updateAvailabilityDates(id:string, dates:Availability['data']['dates']) {

    await client.query(
        q.Update(q.Ref(q.Collection('availabilities'), id), {data: {dates}})
    )
}