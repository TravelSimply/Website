import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import { deleteAccount } from "../../../database/utils/users";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV !== 'development'
})

export default verifyUser(async function DeleteAccount(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {jwtUser, username, junkPublicIds, notificationsId, password} = req.body

        console.log('jwtUser', jwtUser)
        console.log('username', username)
        console.log('publicIds', junkPublicIds)
        console.log('notificationsId', notificationsId)
        console.log('password', password)

        return res.status(200).json({msg: 'success'})

        await Promise.all(junkPublicIds.map(id => new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, {}, (err, result) => {
                if (err) reject('Error deleting image')
                resolve(result)
            })
        })))

        await deleteAccount(jwtUser.userId, jwtUser.email, username, notificationsId)

        return res.status(200).json({msg: 'So it ends... for now'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})