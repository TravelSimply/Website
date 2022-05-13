import { NextApiRequest, NextApiResponse } from "next";
import { getFriendUsernames } from "../../../../../database/utils/users";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function FriendUsernames(req:NextApiRequest, res:NextApiResponse) {

    try {

        const usernames = await getFriendUsernames(req.query.id as string)

        return res.status(200).json(usernames)
    } catch (e) {
        console.log(e)
        return res.status(200).json({msg: 'Internal Server Error'})
    }
})