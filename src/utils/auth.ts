import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { parseCookies } from "nookies";
import { getUserFromEmail } from "./users";
import jwt from 'jsonwebtoken'
import { isVerificationTokenWithEmail } from "./verificationTokens";
import { User } from "../database/interfaces";
import axios from 'axios'
import {signOut as nextAuthSignOut} from 'next-auth/react'
import Router from 'next/router'

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

export async function getAuthToken(ctx:GetServerSidePropsContext) {

    const [session, manualAuthToken] = await Promise.all([getSession({req: ctx.req}), getManualUserAuthToken(ctx)])

    if (!session && !manualAuthToken) return null

    return manualAuthToken || session.user
}

export async function mustNotBeAuthenticated(ctx:GetServerSidePropsContext) {

    const authToken = await getAuthToken(ctx)

    if (!authToken) return null

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
        return {props: {}, redirect: {destination: '/'}}
    }

    return {props: {}, redirect: {destination: '/dashboard'}}
}

export async function getAuthUser(ctx:GetServerSidePropsContext):Promise<{user:User, redirect:GetServerSidePropsResult<any>}> {

    const authToken = await getAuthToken(ctx)

    if (!authToken) {
        return {user: null, redirect: {props: {}, redirect: {destination: '/auth/signin', permanent: false}}}
    }

    try {

        const user = await getUserFromEmail(authToken.email)

        if (!user) throw 'No user found?'

        if (!user.data.username) {
            return {user: null, redirect: {props: {}, redirect: {destination: '/account/setup', permanent: false}}}
        }

        return {user, redirect: null}
    } catch (e) {
        return {user:null, redirect: {props: {}, redirect: {destination: '/', permanent: false}}}
    }
}

// export async function getNotSetupAuthUser(ctx:GetServerSidePropsContext):Promise<{user:User, redirect:GetServerSidePropsResult<any>}> {

// }

export async function signOut() {
    
    const {auth} = parseCookies()

    if (!auth) {
        return nextAuthSignOut()
    }

    try {
        await axios({
            method: 'POST',
            url: '/api/auth/manual-signout'
        })
        Router.push({
            pathname: '/auth/signin'
        })
    } catch (e) {
        console.log(e)
    }
}