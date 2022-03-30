import {NextApiRequest, NextApiResponse} from 'next'
import {getVerificationTokenWithToken, deleteVerificationToken} from '../../../../utils/verificationTokens'
import {createUserFromToken} from '../../../../utils/users'
import jwt from 'jsonwebtoken'
import {setCookie} from 'nookies'

export default async function VerifyEmail(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {
        const {token}:{token:string} = req.body

        if (!token) {
            return res.status(409).json({msg: 'No token provided'})
        }

        const verificationToken = await getVerificationTokenWithToken(token)

        if (!verificationToken) {
            return res.status(409).json({msg: 'Token not found'})
        }

        await Promise.all([createUserFromToken(verificationToken), deleteVerificationToken(verificationToken.ref.id)])

        const jwtToken = jwt.sign({email: verificationToken.data.email}, process.env.TOKEN_SIGNATURE, {expiresIn: '48hr'})

        setCookie({res}, 'auth', jwtToken, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: true,
            maxAge: 172800,
            path: '/'
        })

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal server error'})
    }
}