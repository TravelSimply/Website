import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi, verifyUser } from "../../../../../utils/auth";
import { filterUsers, getUser } from "../../../../../database/utils/users";
import { getFriends } from "../../../../../database/utils/friends";

export default async function Friends(req:NextApiRequest, res:NextApiResponse) {

    try {
        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const user = await getUser(authToken.userId)

        if (!user) {
            throw res.status(403).json({msg: 'No user with those credentials found.'})
        }

        if (!user.data.friends) {
            return res.status(200).json([])
        }

        const friends = await getFriends(user.data.friends)

        return res.status(200).json(filterUsers(friends))
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}