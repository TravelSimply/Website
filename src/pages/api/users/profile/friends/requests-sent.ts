import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi } from "../../../../../utils/auth";
import { getFriendRequestsFromUser, getPopulatedFriendRequestsFromUser, getToOfFriendRequestsFromUser } from "../../../../../database/utils/friendRequests";
import { filterUser, getUser } from "../../../../../database/utils/users";

export default async function FriendRequestsSend(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const requests = (await getPopulatedFriendRequestsFromUser(authToken.userId)).map(request => (
            {...request, data: {...request.data, to: filterUser(request.data.to)}}
        ))

        return res.status(200).json(requests)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}