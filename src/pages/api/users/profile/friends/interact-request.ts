import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../../utils/auth";
import { deleteFriendRequest, getFriendRequest } from "../../../../../database/utils/friendRequests";
import { addFriend } from "../../../../../database/utils/friends";
import { getUser } from "../../../../../utils/users";

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

        if (operation === 'accept') {
            const invite = await getFriendRequest(id)
            if (!invite || invite.data.to !== req.body.jwtUser.userId) {
                return res.status(403).json({msg: 'Cannot accept'})
            }
            await addFriend(invite.data.to, invite.data.from, invite.ref.id)

            return res.status(200).json({msg: 'Success'})
        }

        if (operation === 'reject') {
            const invite = await getFriendRequest(id)
            if (!invite || invite.data.to !== req.body.jwtUser.userId) {
                return res.status(403).json({msg: 'Cannot reject'})
            }
            await deleteFriendRequest(id)
            return res.status(200).json({msg: 'Success'})
        }

        return res.status(400).json({msg: 'No valid operation given'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})