import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi } from "../../../../../utils/auth";
import { getFriendRequestsFromUser, getToOfFriendRequestsFromUser } from "../../../../../database/utils/friendRequests";
import { filterUser, getUser } from "../../../../../utils/users";

export default async function FriendRequestsSend(req:NextApiRequest, res:NextApiResponse) {

    try {

        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const requests = (await getFriendRequestsFromUser(authToken.userId)).data

        const users = await Promise.all(requests.map(request => getUser(request.data.to)))

        const populatedRequests = requests.map((request, i) => ({
            ...request,
            data: {
                ...request.data,
                to: filterUser(users[i])
            }
        }))

        return res.status(200).json(populatedRequests)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}