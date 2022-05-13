import { NextApiRequest, NextApiResponse } from "next";
import { getPopulatedUserNotificationsWithTravelGroupLastUpdated } from "../../../../../database/utils/userNotifications";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function UserNotifications(req:NextApiRequest, res:NextApiResponse) {

    try {

        const info = await getPopulatedUserNotificationsWithTravelGroupLastUpdated(req.query.id as string)

        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})