import {NextApiRequest, NextApiResponse} from 'next'
import { sendToken } from '../../../../utils/emails'
import {isUserWithEmail} from '../../../../database/utils/users'
import {getVerificationTokenWithEmail} from '../../../../database/utils/verificationTokens'

export default async function Resend(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {
        
        if (await isUserWithEmail(req.body.email)) {
            return res.status(409).json({field: 'email', msg: 'This email is already verified.'})
        }

        const token = await getVerificationTokenWithEmail(req.body.email)

        if (!token) {
            return res.status(409).json({field: 'email', msg: 'This email is not registered.'})
        }

        await sendToken(token.data.token, req.body.email)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}