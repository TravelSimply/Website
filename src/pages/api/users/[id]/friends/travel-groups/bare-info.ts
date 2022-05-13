import { NextApiRequest, NextApiResponse } from "next";
import { getFriendsTravelGroupsBareInfo } from "../../../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../../../utils/auth";

export default verifyUser(async function BareInfo(req:NextApiRequest, res:NextApiResponse) {
    
    try {

        const groupInfo = await getFriendsTravelGroupsBareInfo(req.query.id as string)

        return res.status(200).json(groupInfo)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})