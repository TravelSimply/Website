import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import { createUserFromGoogle, getUserFromEmail, getUserFromGoogle } from "../../../utils/users";

const googleScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/contacts.readonly'
]

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    access_type: 'offline',
                    response_type: 'code',
                    scope: googleScopes.join(' ')
                }
            }
        })
    ],
    secret: process.env.TOKEN_SIGNATURE,
    callbacks: {
        async signIn({account, profile}) {
            const returningUser = await getUserFromGoogle(account.providerAccountId)

            if (returningUser) return true

            try {
                await createUserFromGoogle({...profile , picture: profile.picture as string || ''}, account.providerAccountId)
            } catch (e) {
                return false
            }

            return true
        },
        redirect: async ({url, baseUrl}) => new Promise<string>(res => res(url)),
        async jwt({token, user, account}) {

            if (account) {
                const user = await getUserFromGoogle(account.providerAccountId)
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.userId = user.ref.id
            }

            return token
        },
        async session({token}:{token:any}):Promise<any> {
            return new Promise(resolve => resolve(token))
        }
    },
    pages: {
        signIn: '/auth/signin'
    },
    session: {
        maxAge: 2 * 24 * 60 * 60 // 2 days
    }
})