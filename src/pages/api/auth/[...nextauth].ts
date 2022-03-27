import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import { createUser, getUserFromEmail } from "../../../utils/users";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'online',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        async signIn({account, profile}) {
            const returningUser = await getUserFromEmail(profile.email)

            if (returningUser) return true

            try {
                await createUser(profile.email, profile.name, profile.picture as string || '')
            } catch (e) {
                return false
            }

            return true
        }
    },
    pages: {
        signIn: '/auth/signin'
    },
    session: {
        maxAge: 2 * 24 * 60 * 60 // 2 days
    }
})