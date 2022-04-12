import { NextApiRequest, NextApiResponse } from "next";
import { updateAvailabilityDates } from "../../../../../database/utils/availabilities";
import { verifyUser } from "../../../../../utils/auth";

function checkDates(dates:Object) {
    
    if (!dates) {
        throw 'No dates'
    }

    for (const [key, value] of Object.entries(dates)) {
        if (key.length !== 4) {
            throw 'This is not an accepted value'
        }
        let foundProperties = 0
        for (const [dateKey, dateValue] of Object.entries(value)) {
            if (!['travelling', 'available', 'unavailable'].includes(dateKey)) {
                throw 'This is not an accepted value'
            }
            foundProperties++
        }
        if (foundProperties !== 2) {
            throw 'Too many values for this date'
        }
    }
}

export default verifyUser(async function UpdateAvailability(req:NextApiRequest, res:NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(400).json({msg: 'Ok...'})
    }

    try {

        const {id, dates} = req.body

        checkDates(dates)

        await updateAvailabilityDates(id, dates)

        return res.status(200).json({msg: 'Success'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
})