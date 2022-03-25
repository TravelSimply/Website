import {PasswordResetToken} from '../database/interfaces'
import client from '../database/fauna'
import {query as q} from 'faunadb'

export async function createPasswordResetToken(token:string, email:string, userId: string) {

    await client.query(
        q.Create(q.Collection('passwordResetTokens'), {data: {token, email, userId}})
    )
}

export async function getPasswordResetTokenWithEmail(email:string):Promise<PasswordResetToken> {

    return await client.query(
        q.Let(
            {tokenRef: q.Match(q.Index('passwordResetTokens_by_email'), email)},
            q.If(
                q.Exists(q.Var('tokenRef')),
                q.Get(q.Var('tokenRef')),
                null
            )
        )
    )
}

export async function getPasswordResetTokenWithToken(token:string):Promise<PasswordResetToken> {

    return await client.query(
        q.Let(
            {tokenRef: q.Match(q.Index('passwordResetTokens_by_token'), token)},
            q.If(
                q.Exists(q.Var('tokenRef')),
                q.Get(q.Var('tokenRef')),
                null
            )
        )
    )
}

export async function isPasswordResetTokenWithToken(token:string):Promise<boolean> {

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('passwordResetTokens_by_token'), token)),
            true,
            false
        )
    )
}

export async function deletePasswordResetToken(id:string) {
    
    await client.query(
        q.Delete(q.Ref(q.Collection('passwordResetTokens'), id))
    )
}