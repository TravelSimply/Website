import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi, verifyUser } from "../../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import formidable from 'formidable'
import { getUserFromEmail, updateUserImage } from "../../../../database/utils/users";

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

export default async function ChangeImage(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(404).json({msg: 'Not authenticated'})
        }

        const user = await getUserFromEmail(authToken.email)

        if (!user) {
            throw 'No user?'
        }

        const form = formidable.IncomingForm()

        const {files} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err || !files?.file?.path) reject('error uploading file')
                console.log(files.file)
                if (files.file.type.substring(0, 5) !== 'image') reject('this is not an image')
                resolve({files})
            })
        })

        const result:UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(files.file.path, {
                upload_preset: user.data.image?.publicId ? undefined : 'TravelSimplyUsers',
                public_id: user.data.image?.publicId || undefined,
                overwrite: Boolean(user.data.image?.publicId),
                invalidate: true
            }, (err, result) => {
                if (err) reject('error uploading to cloudinary')
                resolve(result)
            })
        })

        await updateUserImage(user.ref.id, {src: result.secure_url, publicId: result.public_id})

        return res.status(200).json({src: result.secure_url})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}