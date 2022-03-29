import { NextApiRequest, NextApiResponse } from "next";
import { getUsernamesAndRefsMatchingSearch, getUsernamesAndRefs } from "../../../../utils/users";

export default async function SearchUsername(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        if (!req.body.username) {
            const users = await getUsernamesAndRefs()
            return res.status(200).json({users})
        }

        const users = await getUsernamesAndRefsMatchingSearch(req.body.username)

        return res.status(200).json({users})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}