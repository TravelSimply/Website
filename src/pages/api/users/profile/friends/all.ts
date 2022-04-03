import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi, verifyUser } from "../../../../../utils/auth";
import { getFriendsInvited, getFriendsInviting } from "../../../../../utils/friends";
import { getUser, filterUsers } from "../../../../../utils/users";

export default async function Friends(req:NextApiRequest, res:NextApiResponse) {

    try {
        const authToken = await getAuthFromApi(req)

        if (!authToken) {
            return res.status(403).json({msg: 'YOU CANNOT PASS'})
        }

        const user = await getUser(authToken.userId)

        if (!user) {
            throw res.status(403).json({msg: 'No user with those credentials found.'})
        }

        const [friends, friendsInvited, friendsInviting] = await Promise.all([
            (user.data.friends ? await Promise.all(user.data.friends.map(friend => getUser(friend))) : []).map(friend => ({...friend, status: 'friend'})),
            (await getFriendsInvited(user.ref.id)).map(friend => ({...friend, status: 'invited'})),
            (await getFriendsInviting(user.ref.id)).map(friend => ({...friend, status: 'inviting'}))
        ])

        return res.status(200).json(filterUsers([...friends, ...friendsInvited, ...friendsInviting]))
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}