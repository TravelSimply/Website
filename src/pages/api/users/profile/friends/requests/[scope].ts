import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi } from "../../../../../../utils/auth";
import { getFromOfFriendRequestsToUser, getToOfFriendRequestsFromUser } from "../../../../../../database/utils/friendRequests";

async function getToAndFrom(id:string) {
    const [to, from] = await Promise.all([getToOfFriendRequestsFromUser(id), getFromOfFriendRequestsToUser(id)])

    return {to: to.data, from: from.data}
}

export default async function Requests(req:NextApiRequest, res:NextApiResponse) {

    try {
        const {scope} = req.query

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const requests = scope === 'fromUser' ? {from: null, to: (await getToOfFriendRequestsFromUser(authToken.userId)).data} :
            scope === 'toUser' ? {to: null, from: (await getFromOfFriendRequestsToUser(authToken.userId)).data} :
            await getToAndFrom(authToken.userId)

        return res.status(200).json(requests)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}