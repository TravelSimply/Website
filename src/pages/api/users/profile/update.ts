import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../utils/auth";
import { isUserWithUsername, updateUser, updateUserFromEmail } from "../../../../utils/users";

const acceptedProperties = ['username', 'firstName', 'lastName']

function checkProperties(properties:Object) {

    if (!properties) throw 'No properties'
    
    for (const [key, value] of Object.entries(properties)) {
        if (!acceptedProperties.includes(key)) {
            throw 'This is not an accepted property'
        }
        if (Object.prototype.toString.call(value) !== '[object String]') {
            throw 'This is not a valid property value'
        }
    }
}

export default verifyUser(async function UpdateProfile(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        checkProperties(req.body.data)

        if (!req.body.data.username) {
            await updateUserFromEmail(req.body.jwtUser.email, req.body.data)
            return res.status(200).json({msg: 'Success'})
        }

        if (await isUserWithUsername(req.body.data.username)) {
            return res.status(409).json({field: 'username', msg: 'This username is already in use.'})
        }

        await updateUser(req.body.jwtUser.userId, req.body.data)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}) 