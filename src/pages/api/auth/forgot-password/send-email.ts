import { NextApiRequest, NextApiResponse } from "next";
import { sendPasswordResetToken } from "../../../../utils/emails";
import { createPasswordResetToken, getPasswordResetTokenWithEmail } from "../../../../database/utils/passwordResetTokens";
import { getUserFromEmail } from "../../../../database/utils/users";
import crypto from 'crypto'

export default async function SendEmail(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {
        if (!req.body.email) {
            return res.status(400).json({msg: 'No email provided'})
        }

        const user = await getUserFromEmail(req.body.email)

        if (!user) {
            return res.status(409).json({field: 'email', msg: 'No user registered with this email.'})
        }

        const passwordResetToken = await getPasswordResetTokenWithEmail(req.body.email)

        if (passwordResetToken) {
            await sendPasswordResetToken(passwordResetToken.data.token, req.body.email)
            return res.status(200).json({msg: 'Success'})
        }

        const token = await new Promise<string>((result, reject) => {
            crypto.randomBytes(48, (err, buffer) => {
                if (err) reject(err)
                result(buffer.toString('hex'))
            })
        })

        await createPasswordResetToken(token, req.body.email, user.ref.id)
        await sendPasswordResetToken(token, req.body.email)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}