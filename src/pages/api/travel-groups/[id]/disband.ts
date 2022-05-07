import { NextApiRequest, NextApiResponse } from "next";
import { disbandTravelGroup } from "../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../utils/auth";

export default verifyUser(async function DisbandTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        await disbandTravelGroup(req.query.id as string)
        
        return res.status(200).json({msg: 'Disbanded!'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})