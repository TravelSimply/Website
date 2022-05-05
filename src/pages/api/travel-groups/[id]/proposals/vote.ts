import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../../utils/auth";
import {cancelProposalVote, voteAgainstProposal, voteForProposal} from '../../../../../database/utils/travelGroupProposals'

export default verifyUser(async function ProposalVote(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {proposalId, jwtUser, cancel, vote} = req.body

        if (vote === 'for') {
            await voteForProposal(proposalId, jwtUser.userId)
            return res.status(200).json({msg: 'Success'})
        }

        if (vote === 'against') {
            await voteAgainstProposal(proposalId, jwtUser.userId)
            return res.status(200).json({msg: 'Success'})
        }

        if (cancel) {
            await cancelProposalVote(proposalId, jwtUser.userId, cancel)
            return res.status(200).json({msg: 'Success'})
        }

        return res.status(400).json({msg: 'Not a valid input'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Sever Error'})
    }
})