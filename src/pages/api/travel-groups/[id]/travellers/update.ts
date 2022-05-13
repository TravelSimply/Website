import { NextApiRequest, NextApiResponse } from "next";
import { updateMembersWithOwnerCheck } from "../../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function UpdateTravellers(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {jwtUser, travellers} = req.body

        await updateMembersWithOwnerCheck(req.query.id as string, jwtUser.userId, travellers)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})