import { NextApiRequest, NextApiResponse } from "next";
import { TravelGroupProposal } from "../../../../../database/interfaces";
import { createProposal } from "../../../../../database/utils/travelGroupProposals";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function Propose(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const info:TravelGroupProposal['data'] = {
            travelGroup: req.query.id as string,
            by: req.body.jwtUser.userId,
            type: req.body.type,
            for: [],
            against: [],
            data: req.body.data,
            timeSent: null
        }

        let junkIds = undefined

        if (info.data.image?.src) {
            junkIds = req.body.userJunkIds as string[]
            junkIds.splice(junkIds.indexOf(info.data.image.publicId), 1)
        }

        const proposal = await createProposal(info, junkIds)

        return res.status(200).json(proposal)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})