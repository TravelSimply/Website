import {NextApiRequest, NextApiResponse} from 'next'
import { isUserWithEmail } from '../../../utils/users'
import { createVerificationToken, isVerificationTokenWithEmail } from '../../../utils/verificationTokens'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendToken } from '../../../utils/emails'

export default async function Signup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        if (await isUserWithEmail(req.body.email)) {
            return res.status(409).json({msg: 'This email is currently in use.', field: 'email'})
        }

        if (await isVerificationTokenWithEmail(req.body.email)) {
            return res.status(409).json({msg: 'This email is awaiting verification.', field: 'email'})
        }

        const [hashedPassword, randomToken]:[string, string] = await Promise.all([
            new Promise<string>((res, rej) => {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) rej(err)
                    res(hash)
                })
            }),
            new Promise<string>((res, rej) => {
                crypto.randomBytes(48, (err, buffer) => {
                    if (err) rej(err)
                    res(buffer.toString('hex'))
                }) 
            })
        ])

        await createVerificationToken(randomToken, {
            email: req.body.email,
            password: hashedPassword
        })

        await sendToken(randomToken, req.body.email)

        return res.status(200).json({msg: 'success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal server error'})
    }
}