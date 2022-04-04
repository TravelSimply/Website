import { NextApiRequest, NextApiResponse } from "next";
import { isPasswordResetTokenWithToken } from "../../../../database/utils/passwordResetTokens";

export default async function VerifyToken(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {
        if (!(await isPasswordResetTokenWithToken(req.body.token))) {
            return res.status(409).json({msg: 'Token not found'})
        }

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}