import { NextApiRequest, NextApiResponse } from "next";
import { discardInvitation, rejectInvitation } from "../../../../../database/utils/travelGroupInvitations";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function DiscardInvitation(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {toUsername, inviteId} = req.body

        await discardInvitation(inviteId)

        return res.status(200).json({msg: 'Success'})
    } catch(e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})