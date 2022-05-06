import { NextApiRequest, NextApiResponse } from "next";
import { rejectProposal } from "../../../../../database/utils/travelGroupProposals";
import { verifyUser } from "../../../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV !== 'development'
})

export default verifyUser(async function RejectProposal(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {proposalId, proposalUserUsername, proposalPublicId} = req.body

        if (proposalPublicId) {
            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(proposalPublicId, {invalidate: true}, (err, result) => {
                    if (err) reject('Error uploading to cloudinary')
                    resolve(result)
                })
            })
        }

        await rejectProposal(proposalId, req.query.id as string, proposalUserUsername)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})