import { NextApiRequest, NextApiResponse } from "next";
import { createTrip } from "../../../../../database/utils/trips";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function CreateTrip(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }
    
    try {

        const trip = await createTrip(req.body.tripData)

        return res.status(200).json({id: trip.ref.id})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})