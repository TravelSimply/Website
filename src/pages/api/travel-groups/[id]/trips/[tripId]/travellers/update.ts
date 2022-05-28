import { NextApiRequest, NextApiResponse } from "next";
import { updateMembersWithLeaderCheck } from "../../../../../../../database/utils/trips";
import { verifyUser } from "../../../../../../../utils/auth";

export default verifyUser(async function UpdateTravellers(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {jwtUser, travellers} = req.body

        await updateMembersWithLeaderCheck(req.query.tripId as string, jwtUser.userId, travellers)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})