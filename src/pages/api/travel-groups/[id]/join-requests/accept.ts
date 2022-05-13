import { NextApiRequest, NextApiResponse } from "next";
import { acceptJoinRequestAndGetTravellerContactInfo } from "../../../../../database/utils/travelGroupJoinRequests";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function AcceptJoinRequest(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {requestId, travellerId, userContactInfo, travellerUsername} = req.body
        const travelGroupId = req.query.id as string

        if (userContactInfo) {
            const contactInfo = await acceptJoinRequestAndGetTravellerContactInfo(requestId, travellerId, travelGroupId, 
                travellerUsername)
            return res.status(200).json(contactInfo)
        }
        
        return res.status(400).json({msg: 'Must specify you want contact info currently'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})