import { NextApiRequest, NextApiResponse } from "next";
import { addTravelGroups } from "../../../../database/utils/userNotifications";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function AddTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {id, travelGroups} = req.body

        await addTravelGroups(id, travelGroups)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})