import { NextApiRequest, NextApiResponse } from "next";
import { leaveTravelGroup } from "../../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../../utils/auth";
import { deleteAllPublicIds } from "../disband";

export default verifyUser(async function LeaveTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {travelGroupPublicId} = req.body

        const info = await leaveTravelGroup(req.query.id as string, req.body.jwtUser.userId, req.body.username)

        if ((info as any).ref) {
            return res.status(200).json({msg: 'Success'})
        }

        const publicIds = []
        if (travelGroupPublicId) publicIds.push(travelGroupPublicId)
        publicIds.push(...info.data)

        await deleteAllPublicIds(publicIds)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})