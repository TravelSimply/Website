import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../../utils/auth";
import { removeFriend } from "../../../../../database/utils/friends";

export default verifyUser(async function RemvoeFriend(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {id} = req.body

        if (!id) {
            return res.status(403).json({msg: 'No id?'})
        }

        await removeFriend(req.body.jwtUser.userId, id)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})