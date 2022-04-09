import {Expr, query as q} from 'faunadb'
import client from '../fauna'
import { Availability } from '../interfaces'

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
    travelGroups: {data: [Expr, Expr][]};
}

export function populateAvailability(info:PopulateAvailabilityProps) {

    if (!info) {
        return null
    }

    const {availability, travelGroups} = info
}

export async function getAvailabilityAndTravelGroupsOfUser(userId:string):Promise<PopulateAvailabilityProps> {

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('availabilities_by_userId'), userId)),
            q.Let(
                {
                    availability: q.Get(q.Match(q.Index('availabilities_by_userId'), userId)),
                    travelGroups: q.Map(q.Paginate(q.Match(q.Index('travelGroups_by_members_w_date'), userId)), (ref) => q.Get(ref))
                },
                {
                    availability: q.Var('availability'),
                    travelGroups: q.Var('travelGroups')
                }
            ),
            null
        )
    )
}