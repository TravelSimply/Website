import { NextApiRequest, NextApiResponse } from "next";
import { sendJoinRequest } from "../../../../../database/utils/travelGroupJoinRequests";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function SendJoinRequest(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        await sendJoinRequest(req.query.id as string, req.body.jwtUser.userId)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})