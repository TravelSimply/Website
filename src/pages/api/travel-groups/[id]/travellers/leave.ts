import { NextApiRequest, NextApiResponse } from "next";
import { leaveTravelGroup } from "../../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function LeaveTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        await leaveTravelGroup(req.query.id as string, req.body.jwtUser.userId, req.body.username)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})