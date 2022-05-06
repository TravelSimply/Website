import { NextApiRequest, NextApiResponse } from "next";
import { rejectProposal } from "../../../../../database/utils/travelGroupProposals";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function RejectProposal(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {proposalId, proposalUserUsername} = req.body

        await rejectProposal(proposalId, req.query.id as string, proposalUserUsername)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})