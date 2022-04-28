import { NextApiRequest, NextApiResponse } from "next";
import { rescindInvitation } from "../../../../../database/utils/travelGroupInvitations";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function RescindInvitation(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        console.log('inviteId', req.body.inviteId)
        await rescindInvitation(req.body.inviteId as string)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})