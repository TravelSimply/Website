import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupNotifications } from "../../../../../database/utils/travelGroupNotifications";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function TravelGroupNotifications(req:NextApiRequest, res:NextApiResponse) {

    try {

        const notifications = await getTravelGroupNotifications(req.query.id as string)

        return res.status(200).json(notifications)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})