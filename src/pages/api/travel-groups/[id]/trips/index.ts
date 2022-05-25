import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupTrips } from "../../../../../database/utils/trips";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function Trips(req:NextApiRequest, res:NextApiResponse) {

    try {

        const trips = await getTravelGroupTrips(req.query.id as string)

        return res.status(200).json(trips.data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})