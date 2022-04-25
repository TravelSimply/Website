import { NextApiRequest, NextApiResponse } from "next";
import { sendInvitationsWithNotificationUpdate } from "../../../../../database/utils/travelGroupInvitations";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function SendInvite(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {travelGroupId, to, jwtUser} = req.body

        const invites = await sendInvitationsWithNotificationUpdate(jwtUser.userId, to, travelGroupId)

        return res.status(200).json(invites)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})