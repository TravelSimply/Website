import client from '../database/fauna'
import {query as q} from 'faunadb'
import {VerificationToken} from '../database/interfaces'

export async function isVerificationTokenWithEmail(email:string) {

    if (!email) {
        return true
    }

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('verificationTokens_by_email'), email)),
            true,
            false
        )
    )
}

export async function createVerificationToken(token:string, userInfo:{email:string, password:string}) {

    await client.query(
        q.Create(q.Collection('verificationTokens'), {data: {token, ...userInfo}})
    )
}