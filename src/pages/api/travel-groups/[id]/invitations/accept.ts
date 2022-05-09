import { NextApiRequest, NextApiResponse } from "next";
import { acceptInvitation } from "../../../../../database/utils/travelGroupInvitations";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function AcceptInvitation(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {toUsername, inviteId} = req.body

        await acceptInvitation(inviteId, req.body.jwtUser.userId, toUsername, req.query.id as string)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})