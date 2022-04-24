import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupMembersWithContactInfo } from "../../../../database/utils/travelGroups";
import { getTravellersWithContactInfo } from "../../../../database/utils/users";

export default async function getTravellers(req:NextApiRequest, res:NextApiResponse) {

    try {

        const popTravellers = await getTravelGroupMembersWithContactInfo(req.query.id as string)

        console.log('POPULATING TRAVELLERS')

        return res.status(200).json(popTravellers)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}