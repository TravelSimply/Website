import { NextApiRequest, NextApiResponse } from "next";
import { getPasswordResetTokenWithToken } from "../../../../utils/passwordResetTokens";
import bcrypt from 'bcryptjs'
import { updateUserPassword } from "../../../../utils/users";
import {deletePasswordResetToken} from '../../../../utils/passwordResetTokens'

export default async function ResetPassword(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        if (!req.body.token || !req.body.password) {
            return res.status(400).json({msg: 'No token or password'})
        }

        const token = await getPasswordResetTokenWithToken(req.body.token)

        if (!token) {
            return res.status(409).json({msg: 'No token found'})
        }

        const hashedPassword = await new Promise<string>((result, reject) => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) reject(err)
                result(hash)
            }) 
        })

        await Promise.all([updateUserPassword(token.data.userId, req.body.password), deletePasswordResetToken(token.ref.id)])

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}