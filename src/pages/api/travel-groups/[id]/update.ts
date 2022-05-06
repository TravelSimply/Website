import { NextApiRequest, NextApiResponse } from "next";
import { getTravelGroupOwner, updateTravelGroupWithOwnerCheck } from "../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV !== 'development'
})

export default verifyUser(async function UpdateTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {data, userJunkIds, originalPublicId} = req.body

        let junkIds = undefined

        if (data.image?.src) {
            junkIds = userJunkIds as string[] 
            junkIds.splice(junkIds.indexOf(data.image.publicId), 1)
        }

        await updateTravelGroupWithOwnerCheck(req.query.id as string, req.body.jwtUser.userId, data, junkIds)

        if (!junkIds || !originalPublicId) {
            return res.status(200).json({msg: 'Success'})
        }

        await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(originalPublicId, {invalidate: true}, (err, result) => {
                if (err) reject('Error uploading to cloudinary')
                resolve(result)
            })
        })

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})