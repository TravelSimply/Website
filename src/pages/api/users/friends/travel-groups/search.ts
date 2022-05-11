import { NextApiRequest, NextApiResponse } from "next";
import { searchForTravelGroup } from "../../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function SearchForTravelGroups(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(500).json({msg: 'Ok...'})
    }

    try {

        const {travelGroupIds, filters, maxFinds} = req.body

        const search = await searchForTravelGroup(req.body.jwtUser.userId, filters, travelGroupIds, maxFinds)

        console.log('search', search)

        return res.status(200).json(search)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})