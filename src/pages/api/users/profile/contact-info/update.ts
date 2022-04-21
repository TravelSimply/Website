import { NextApiRequest, NextApiResponse } from "next";
import { updateContactInfoInfo } from "../../../../../database/utils/contactInfo";
import { verifyUser } from "../../../../../utils/auth";

function checkInfo(info:Object) {

    if (!info) {
        throw 'No info'
    }

    for (const [key, value] of Object.entries(info)) {
        if (key == 'phones') {
            for (const phoneType of Object.keys(value)) {
                if (phoneType !== 'home' && phoneType !== 'mobile') {
                    throw 'Invalid phone' 
                }
            }
            continue
        }
        if (key == 'email') {
            continue
        }
        if (key == 'socials') {
            const socials = ['whatsapp', 'discord', 'facebook', 'groupMe']
            for (const socialType of Object.keys(value)) {
                if (!socials.includes(socialType)) {
                    throw 'Invalid social'
                }
            }
            continue
        }
        throw 'Invalid info'
    }
}

export default verifyUser(async function UpdateContactInfo(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {id, info} = req.body

        checkInfo(info)

        await updateContactInfoInfo(id, info)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})