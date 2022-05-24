import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../utils/auth";
import {createTravelGroup as dbCreateTravelGroup} from '../../../database/utils/travelGroups'
import dayjs from "dayjs";

const acceptedProperties = [{name: 'owner', type: 'string'}, {name: 'members', type: 'object'},
 {name: 'name', type: 'string'}, {name: 'desc', type: 'string'}, {name: 'settings', type: 'object'}]
const settingsProperties = ['mode', 'invitePriveleges', 'joinRequestPriveleges']

function checkProperties(properties:Object) {
    
    if (!properties) throw 'No properties'

    let foundProperties = 0

    for (const [key, value] of Object.entries(properties)) {
        foundProperties++
        if (!acceptedProperties.find(prop => prop.name === key && prop.type === typeof value)) {
            throw 'This is not an accepted property'
        }
        if (key === 'members' && !Array.isArray(value)) {
            throw 'This is not an accepted property'
        }
        if (key === 'settings') {
            let count = 0
            for (const [settingsKey, settingsValue] of Object.entries(value)) {
                count++
                if (!settingsProperties.find(prop => prop === settingsKey && (typeof settingsValue === 'string'))) {
                    throw 'This is not an accepted property'
                }
            }
            if (count !== settingsProperties.length) {
                throw 'Did not include all necessary properties'
            }
        }
    }

    if (foundProperties !== acceptedProperties.length) {
        throw 'Did not include all necessary properties'
    }
}

export default verifyUser(async function createTravelGroup(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        checkProperties(req.body.data)

        const group = await dbCreateTravelGroup(req.body.data)

        return res.status(200).json({id: group.ref.id})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})