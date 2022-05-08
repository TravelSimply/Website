import { NextApiRequest, NextApiResponse } from "next";
import { markAllAsViewed } from "../../../../database/utils/userNotifications";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function AllSeenNotifications(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {id, basic, travelGroups} = req.body

        await markAllAsViewed(id, basic, travelGroups)

        return res.status(200).json({msg: 'Updated'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})