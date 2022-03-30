import { NextApiRequest, NextApiResponse } from "next";
import {setCookie} from 'nookies'

export default async function ManualSignOut(req:NextApiRequest, res:NextApiResponse) {

    setCookie({res}, 'auth', '', {
        maxAge: 0,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    })

    return res.status(200).json({msg: 'Signing out...'})
}