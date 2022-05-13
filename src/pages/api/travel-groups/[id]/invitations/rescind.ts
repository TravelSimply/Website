import { NextApiRequest, NextApiResponse } from "next";
import { rescindInvitation } from "../../../../../database/utils/travelGroupInvitations";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function RescindInvitation(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const not = await rescindInvitation(req.body.inviteId, req.body.to, req.query.id as string)

        console.log('newNot', not)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})