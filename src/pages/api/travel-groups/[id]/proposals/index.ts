import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupProposals } from "../../../../../database/utils/travelGroupProposals";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function TravelGroupProposals(req:NextApiRequest, res:NextApiResponse) {

    try {

        const {data: proposals} = await getTravelGroupProposals(req.query.id as string)

        return res.status(200).json(proposals)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})