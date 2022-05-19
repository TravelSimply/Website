import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../utils/auth";
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary'
import { deleteAccount, getUser, getUserAndTravelGroupRefs } from "../../../database/utils/users";
import bcrypt from 'bcryptjs'

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

        const {jwtUser, notificationsId, password} = req.body

        // const user = await getUser(jwtUser.userId)
        const {user, travelGroups} = await getUserAndTravelGroupRefs(jwtUser.userId)

        if (!user) {
            throw 'No user found somehow...!'
        }

        if (travelGroups.data.length > 0) {
            return res.status(400).json({msg: 'You must not be in any Travel Groups before deleting your account!'})
        }

        console.log('jwtUser', jwtUser)
        console.log('notificationsId', notificationsId)
        console.log('password', password)
        console.log('user', user)
        console.log('travelGroups', travelGroups)

        const isCorrectPassword = password ? await new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(password, user.data.password, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        }) : true

        if (!isCorrectPassword) {
            return res.status(409).json({field: 'password', msg: 'Incorrect Password.'})
        }

        const publicIdsToRemove = user.data.image?.publicId ? [...(user.data.junkImagePublicIds || []), user.data.image.publicId] :
            user.data.junkImagePublicIds || []

        await Promise.all(publicIdsToRemove.map(id => new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, {}, (err, result) => {
                if (err) reject('Error deleting image')
                resolve(result)
            })
        })))

        await deleteAccount(jwtUser.userId, jwtUser.email, user.data.username, notificationsId)

        return res.status(200).json({msg: 'So it ends... for now'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})