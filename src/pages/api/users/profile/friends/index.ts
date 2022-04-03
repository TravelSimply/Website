// import { NextApiRequest, NextApiResponse } from "next";
// import { getAuthFromApi, verifyUser } from "../../../../../utils/auth";
// import { getUser } from "../../../../../utils/users";

// export default async function Friends(req:NextApiRequest, res:NextApiResponse) {

//     try {
//         const authToken = await getAuthFromApi(req)

//         if (!authToken) {
//             return res.status(403).json({msg: 'YOU CANNOT PASS'})
//         }

//         const user = await getUser(authToken.userId)

//         if (!user) {
//             throw res.status(403).json({msg: 'No user with those credentials found.'})
//         }

//         if (!user.data.friends) {
//             return []
//         }

//         const [...friends] = await Promise.all(user.data.friends.map(friend => getUser(friend)))

//         return res.status(200).json(friends)
//     } catch (e) {
//         return res.status(500).json({msg: 'Internal Server Error'})
//     }
// }