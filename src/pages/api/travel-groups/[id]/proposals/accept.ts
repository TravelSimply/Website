import { NextApiRequest, NextApiResponse } from "next";
import { acceptProposal } from "../../../../../database/utils/travelGroupProposals";
import { verifyUser } from "../../../../../utils/auth";

export default verifyUser(async function AcceptProposal(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {proposalId, proposalUserUsername, data} = req.body

        await acceptProposal(proposalId, req.query.id as string, proposalUserUsername, data)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})