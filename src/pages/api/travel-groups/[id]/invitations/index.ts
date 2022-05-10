import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupInvitations, getTravelGroupInvitationsWithToPopulated } from "../../../../../database/utils/travelGroupInvitations";

export default async function TravelGroupInvitations(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {userId} = req.query

        if (userId) {

        }

        const {data: invites} = await getTravelGroupInvitationsWithToPopulated(req.query.id as string)

        return res.status(200).json(invites)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}