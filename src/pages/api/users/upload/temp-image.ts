import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi, verifyUser } from "../../../../utils/auth";
import formidable from 'formidable'
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import { updateUserJunkImagePublicIds } from "../../../../database/utils/users";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV !== 'development'
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function UploadTempImage(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(404).json({msg: 'Not authenticated'})
        }

        const userId = authToken.userId

        const form = formidable.IncomingForm()

        const {fields: {allPublicIds, publicIdToModify}, files} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err || !files?.file?.path) reject('error uploading file')
                console.log(files.file)
                if (files.file.type.substring(0, 5) !== 'image') reject('this is not an image')
                resolve({fields, files})
            })
        })

        const result:UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(files.file.path, {
                upload_preset: publicIdToModify ? undefined : 'TravelSimplyUsers',
                public_id: publicIdToModify || undefined,
                overwrite: Boolean(publicIdToModify),
                invalidate: true
            }, (err, result) => {
                if (err) reject('error uploading to cloudinary')
                resolve(result)
            })
        })

        if (!publicIdToModify) {
            const publicIds = !allPublicIds.split(' ')[0] ? [result.public_id] : [...allPublicIds.split(' '), result.public_id]
            await updateUserJunkImagePublicIds(userId, publicIds)
        }

        return res.status(200).json({src: result.secure_url, publicId: result.public_id})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}