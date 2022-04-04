import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi } from "../../../../../utils/auth";
import { getFriendRequestsFromUser, getFriendRequestsToUser, getToOfFriendRequestsFromUser } from "../../../../../database/utils/friendRequests";
import { filterUser, getUser } from "../../../../../database/utils/users";

export default async function FriendRequestsReceived(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const requests = (await getFriendRequestsToUser(authToken.userId)).data

        const users = await Promise.all(requests.map(request => getUser(request.data.from)))

        const populatedRequests = requests.map((request, i) => ({
            ...request,
            data: {
                ...request.data,
                from: filterUser(users[i])
            }
        }))

        return res.status(200).json(populatedRequests)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}