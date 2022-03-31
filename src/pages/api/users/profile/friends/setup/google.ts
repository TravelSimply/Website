import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../../../database/interfaces";
import { AuthToken, verifyUser } from "../../../../../../utils/auth";
import { getUser, getUsersWithEmails } from "../../../../../../utils/users";
import {google, people_v1} from 'googleapis'

export default verifyUser(async function GoogleContacts(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const user = await getUser(req.body.jwtUser.userId)

        if (!user) throw 'no user?'

        if (!user.data.oAuthIdentifier?.google) {
            return res.status(400).json({msg: 'Not authenticated with google'})
        }

        const oath2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        ) 

        oath2Client.setCredentials(({
            refresh_token: req.body.jwtUser.refreshToken,
            access_token: req.body.jwtUser.accessToken
        }))

        const service = google.people({version: 'v1', auth: oath2Client})

        const connections:people_v1.Schema$Person[] = await new Promise((resolve, reject) => service.people.connections.list({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses'
        }, (err, response) => {
            if (err) reject(err)
            const connections = response.data.connections
            resolve(connections)
        }))

        if (!connections) {
            return res.status(200).json({friends: []})
        }

        const emails = []
        connections.forEach(connection => connection.emailAddresses?.map(email => emails.push(email.value)))

        const uniqueEmails = Array.from(new Set(emails))

        const friends = await getUsersWithEmails(uniqueEmails)
        
        return res.status(200).json({friends: friends.data.filter(friend => friend.data.email !== req.body.jwtUser.email)})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})