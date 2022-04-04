import { NextApiRequest, NextApiResponse } from "next";
import { getUsernamesAndRefsMatchingSearch, getUsernamesAndRefs, getUserFromUsername, filterUser } from "../../../../database/utils/users";

export default async function SearchUsername(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const user = await getUserFromUsername(req.body.username)

        if (!user) {
            return res.status(200).json({user})
        }

        return res.status(200).json({user: filterUser(user)})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}