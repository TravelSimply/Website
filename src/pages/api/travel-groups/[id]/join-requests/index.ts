import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupJoinRequestsWithFromPopulated } from "../../../../../database/utils/travelGroupJoinRequests";
import { verifyUser } from "../../../../../utils/auth";

export default async function TravelGroupJoinRequests(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {data: requests} = await getTravelGroupJoinRequestsWithFromPopulated(req.query.id as string)

        return res.status(200).json(requests)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}