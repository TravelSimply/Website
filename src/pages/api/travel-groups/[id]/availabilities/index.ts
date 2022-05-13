import { NextApiRequest, NextApiResponse } from "next";
import { getAvailabilitiesOfTravelGroupMembers, populateAvailabilities } from "../../../../../database/utils/availabilities";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function TravelGroupAvailabilities(req:NextApiRequest, res:NextApiResponse) {

    try {

        const availabilities = populateAvailabilities(await getAvailabilitiesOfTravelGroupMembers(req.query.id as string))

        return res.status(200).json(availabilities)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})