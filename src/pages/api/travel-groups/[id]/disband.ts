import { NextApiRequest, NextApiResponse } from "next";
import { disbandTravelGroup } from "../../../../database/utils/travelGroups";
import { verifyUser } from "../../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV !== 'development'
})

export function deleteAllPublicIds(publicIds:string[]) {
    return Promise.all(publicIds.map(publicId => (
        new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, {invalidate: true}, (err, result) => {
                if (err) reject('Error destroying')
                resolve(result)
            })
        })
    )))
}

export default verifyUser(async function DisbandTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {travelGroupPublicId} = req.body

        const proposalIds = await disbandTravelGroup(req.query.id as string)

        const publicIds = []
        if (travelGroupPublicId) publicIds.push(travelGroupPublicId)
        publicIds.push(...proposalIds.data)

        await deleteAllPublicIds(publicIds)
        
        return res.status(200).json({msg: 'Disbanded!'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})