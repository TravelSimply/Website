import client from '../database/fauna'
import {query as q} from 'faunadb'
import { User, VerificationToken } from '../database/interfaces'

function filterName(name:string) {
    return name.split('').slice(0, 50 < name.length ? 50 : name.length).map(char => {
        if (!char.match(/^[0-9a-z]+$/i)) {
            return '_'
        }
        return char
    }).join('')
}

async function createUniqueUsername(name:string) {
    const filteredName = filterName(name)

    let uniqueName = filteredName 
    while (await getUser(uniqueName)) {
        uniqueName = filteredName + Math.round(Math.random() * 100000000)
    }

    return uniqueName
}

export async function createUser(email:string, name:string, picture:string) {
    const [firstName, lastName] = name.split(' ')

    const username = ''

    const user:User = await client.query(
        q.Create(q.Collection('users'), {data: {
            email,
            firstName,
            lastName,
            picture,
            status: [],
            username
        }})
    )

    return user
}

export async function createUserFromToken(token:VerificationToken) {

    const user:User = await client.query(
        q.Create(q.Collection('users'), {data: {email: token.data.email, password: token.data.password}})
    )

    return user
}

export async function getUserFromEmail(email:string) {

    if (!email) {
        return null
    }
    
    const user:User = await client.query(
        q.Let(
            {ref: q.Match(q.Index('users_by_email'), email)}, 
            q.If(
                q.Exists(q.Var('ref')),
                q.Get(q.Var('ref')),
                null
            )
        )
    )

    return user
}

export async function isUserWithEmail(email:string) {

    if (!email) {
        return true
    }

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('users_by_email'), email)),
            true,
            false
        )
    )
}

export async function getUser(id:string) {

    const user:User = await client.query(q.Get(q.Ref(q.Collection('users'), id)))

    return user
}

export async function updateUserPassword(id:string, password:string) {

    await client.query(
        q.Update(q.Ref(q.Collection('users'), id), {data: {password}})
    )
}