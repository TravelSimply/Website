import { NextApiRequest, NextApiResponse } from "next";
import { getTripMembersWithContactInfo } from "../../../../../../../database/utils/trips";
import { verifyUser } from "../../../../../../../utils/auth";

export default verifyUser(async function Travelers(req:NextApiRequest, res:NextApiResponse) {

    try {

        const travellers = await getTripMembersWithContactInfo(req.query.tripId as string)

        console.log(travellers)

        return res.status(200).json(travellers)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})