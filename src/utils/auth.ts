import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { parseCookies } from "nookies";
import { getUserFromEmail } from "./users";
import jwt from 'jsonwebtoken'
import { isVerificationTokenWithEmail } from "./verificationTokens";

export interface AuthToken {
    email: string;
    name?: string;
    picture?: string;
    sub?: string;
    iat?: string;
}

export async function getManualUserAuthToken(ctx:GetServerSidePropsContext) {

    const {auth} = parseCookies(ctx)

    if (!auth) return null

    return new Promise<AuthToken>((res, rej) => {
        jwt.verify(auth, process.env.TOKEN_SIGNATURE, (err, decoded) => {
            if (!err && decoded) res(decoded)
            res(null)
        })
    })
}

export async function mustNotBeAuthenticated(ctx:GetServerSidePropsContext) {

    const [session, manualAuthToken] = await Promise.all([getSession({req: ctx.req}), getManualUserAuthToken(ctx)])

    if (!session && !manualAuthToken) return null

    const authToken = manualAuthToken || session.user

    try {
        const user = await getUserFromEmail(authToken.email)
        
        if (!user && await isVerificationTokenWithEmail(authToken.email)) {
            return {props: {}, redirect: {destination: `/auth/verifyemail?email=${encodeURIComponent(authToken.email)}`}}
        }

        if (!user) throw 'no user found?'

        if (!user.data.username) {
            return {props: {}, redirect: {destination: '/account/setup'}}
        }
    } catch (e) {
        console.log(e)
    }

    return {props: {}, redirect: {destination: '/'}}
}