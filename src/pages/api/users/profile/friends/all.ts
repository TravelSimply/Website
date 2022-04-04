import { NextApiRequest, NextApiResponse } from "next";
import { getAuthFromApi, verifyUser } from "../../../../../utils/auth";
import { getFriendsInvited, getFriendsInviting } from "../../../../../database/utils/friends";
import { getUser, filterUsers } from "../../../../../database/utils/users";

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

        const filteredUsers = filterUsers([...friends, ...friendsInvited, ...friendsInviting])

        filteredUsers.sort((a, b) => (a.data.caseInsensitiveUsername || '').localeCompare(b.data.caseInsensitiveUsername || ''))

        return res.status(200).json(filteredUsers)
    } catch (e) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}