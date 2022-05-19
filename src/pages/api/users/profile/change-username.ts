import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromUsername, isUserWithUsername, updateUserUsernameFromEmail } from "../../../../database/utils/users";
import {verifyUser} from '../../../../utils/auth'

export default verifyUser(async function ChangeUsername(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {username} = req.body

        if (!((username).match(/^[a-zA-Z0-9_]*$/))) {
            return res.status(409).json({field: 'username', msg: 'Username can only include numbers, letters, and underscores.'})
        }
        
        if (username.toLowerCase() === 'deleted') {
            return res.status(409).json({field: 'username', msg: 'This name is reserved.'})
        }

        const userWithUsername = await isUserWithUsername(username)

        if (userWithUsername) {
            return res.status(409).json({field: 'username', msg: 'This username is already in use.'})
        }

        await updateUserUsernameFromEmail(req.body.jwtUser.email, username)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})