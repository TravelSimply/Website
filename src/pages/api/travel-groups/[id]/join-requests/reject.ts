import { NextApiRequest, NextApiResponse } from "next";
import { rejectJoinRequest } from "../../../../../database/utils/travelGroupJoinRequests";
import { verifyUser } from "../../../../../utils/auth";


export default verifyUser(async function RejectJoinRequest(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {requestId} = req.body

        await rejectJoinRequest(requestId)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})