import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../../utils/auth";
import { createFriendRequests } from "../../../../../utils/friendRequests";

export default verifyUser(async function RequestFriends(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {emails} = req.body

        await createFriendRequests(emails, req.body.jwtUser.email)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})