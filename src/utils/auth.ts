import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { parseCookies } from "nookies";
import { getUser, getUserFromEmail } from "./users";
import jwt from 'jsonwebtoken'
import { isVerificationTokenWithEmail } from "./verificationTokens";
import { User } from "../database/interfaces";
import axios from 'axios'
import {signOut as nextAuthSignOut} from 'next-auth/react'
import Router from 'next/router'
import { Session } from "next-auth";

export interface AuthToken {
    email: string;
    userId: string;
    name?: string;
    picture?: string;
    sub?: string;
    iat?: string;
    accessToken?:string;
    refreshToken?:string;
}

declare module "next-auth" {
    interface User {}
    interface Session extends User, AuthToken {
        accessToken:string;
        refreshToken:string;
    }
}

async function getManualUserAuthTokenFromApiHandler(req:NextApiRequest) {
    const auth = req.cookies.auth

    if (!auth) return null

    return new Promise<AuthToken>(resolve => {
        jwt.verify(auth, process.env.TOKEN_SIGNATURE, (err, decoded) => {
            if (!err && decoded) resolve(decoded)
            resolve(null)
        })
    })
}

async function getAuthTokenFromApiHandler(req:NextApiRequest) {

    const [session, manualAuthToken] = await Promise.all([getSession({req}), getManualUserAuthTokenFromApiHandler(req)])

    if (!session && !manualAuthToken) return null

    return manualAuthToken || session
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

    console.log('session', session)
    console.log('manualAuth', manualAuthToken)

    return manualAuthToken || session
}

export async function mustNotBeAuthenticated(ctx:GetServerSidePropsContext) {

    const authToken = await getAuthToken(ctx)

    if (!authToken) return null

    try {
        const user = await getUser(authToken.userId)
        
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

        const user = await getUser(authToken.userId)

        if (!user) throw 'No user found?'

        if (!user.data.username) {
            return {user: null, redirect: {props: {}, redirect: {destination: '/account/setup', permanent: false}}}
        }

        return {user, redirect: null}
    } catch (e) {
        return {user:null, redirect: {props: {}, redirect: {destination: '/', permanent: false}}}
    }
}

export async function getNotSetupAuthUser(ctx:GetServerSidePropsContext):Promise<{user:User, redirect:GetServerSidePropsResult<any>}> {

    const authToken = await getAuthToken(ctx)

    if (!authToken) {
        return {user: null, redirect: {props: {}, redirect: {destination: '/auth/signin', permanent: false}}}
    }

    try {
        const user = await getUser(authToken.userId)

        if (!user) throw 'No user found?'

        if (user.data.username) {
            return {user: null, redirect: {props: {}, redirect: {destination: '/dashboard', permanent: false}}}
        }

        return {user, redirect: null}
    } catch (e) {
        return {user: null, redirect: {props: {}, redirect: {destination: '/', permanent: false}}}
    }
}

export function verifyUser(fn:NextApiHandler) {
    return (req:NextApiRequest, res:NextApiResponse) => {
        return new Promise<void>(resolve => {
            getAuthTokenFromApiHandler(req).then(async (authToken) => {
                if (!authToken) {
                    res.status(403).json({msg: 'YOU CANNOT PASS'})
                    return resolve()
                }
                if (req.method !== 'GET') {
                    req.body.jwtUser = authToken
                }
                await fn(req, res)
                return resolve()
            }).catch(() => {
                res.status(500).json({msg: 'Internal Server Error'})
                return resolve()
            })
        })
    }
}

export function getAuthFromApi(req:NextApiRequest) {
    return new Promise<AuthToken | Session>(resolve => {
        getAuthTokenFromApiHandler(req).then((authToken) => {
            if (!authToken) {
                return resolve(null)
            }
            return resolve(authToken)
        }).catch(() => {
            return resolve(null)
        })
    })
}

export async function signOut() {
    
    const {auth} = parseCookies()

    if (!auth) {
        return nextAuthSignOut({callbackUrl: `/auth/signin`})
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