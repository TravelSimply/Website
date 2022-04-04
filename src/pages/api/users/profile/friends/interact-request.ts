import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../../utils/auth";
import { deleteFriendRequest, getFriendRequest } from "../../../../../utils/friendRequests";

export default verifyUser(async function InteractRequest(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {operation, id} = req.body

        if (operation === 'rescind') {
            const invite = await getFriendRequest(id)
            if (!invite || invite.data.from !== req.body.jwtUser.userId) {
                return res.status(403).json({msg: 'Cannot rescind'})
            }
            await deleteFriendRequest(id)
            return res.status(200).json({msg: 'Success'})
        }

        return res.status(400).json({msg: 'No valid operation given'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})