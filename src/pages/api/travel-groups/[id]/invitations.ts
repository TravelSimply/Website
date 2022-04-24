import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupInvitations } from "../../../../database/utils/travelGroupInvitations";

export default async function TravelGroupInvitations(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {data: invites} = await getTravelGroupInvitations(req.query.id as string)

        return res.status(200).json(invites)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}