import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromEmail } from "../../../database/utils/users";
import { isVerificationTokenWithEmail } from "../../../database/utils/verificationTokens";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {setCookie} from 'nookies'

export default async function SignIn(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {email, password} = req.body

        const user = await getUserFromEmail(email)

        if (!user) {
            const msg = await isVerificationTokenWithEmail(email) ? 'This email is not verified.' : 'This email is not registered.'
            return res.status(409).json({field: 'email', msg})
        }

        const isCorrectPassword = await new Promise<boolean>((promiseResult, reject) => {
            bcrypt.compare(password, user.data.password, (err, result) => {
                if (err) reject(err)
                promiseResult(result)
            }) 
        })

        if(!isCorrectPassword) {
            return res.status(409).json({field: 'password', msg: 'Incorrect password.'})
        }

        const jwtToken = jwt.sign({email, userId: user.ref.id}, process.env.TOKEN_SIGNATURE, {expiresIn: '48hr'})

        setCookie({res}, 'auth', jwtToken, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: true,
            maxAge: 172800,
            path: '/'
        })

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}