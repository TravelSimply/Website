import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi } from "../../../../../utils/auth";
import { getFriendRequestsFromUser, getFriendRequestsToUser, getPopulatedRequestsToUser, getToOfFriendRequestsFromUser } from "../../../../../database/utils/friendRequests";
import { filterUser, getUser } from "../../../../../database/utils/users";

export default async function FriendRequestsReceived(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const requests = (await getPopulatedRequestsToUser(authToken.userId)).map(request => (
            {...request, data: {...request.data, from: filterUser(request.data.from)}}
        ))

        return res.status(200).json(requests)
    } catch (e) {
        console.log(e)
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}