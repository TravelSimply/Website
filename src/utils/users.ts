import client from '../database/fauna'
import {query as q} from 'faunadb'
import { Ref, User, VerificationToken } from '../database/interfaces'

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
            image: {src: picture},
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

export async function getUserFromUsername(username:string):Promise<User> {

    return await client.query(
        q.Let(
            {ref: q.Match(q.Index('users_by_caseInsensitiveUsername'), q.Casefold(username))}, 
            q.If(
                q.Exists(q.Var('ref')),
                q.Get(q.Var('ref')),
                null
            )
        )
    )
}

export async function isUserWithUsername(username:string):Promise<boolean> {

    if (!username) {
        return true
    }

    return await client.query(
        q.If(
            q.Exists(q.Match(q.Index('users_by_caseInsensitiveUsername'), q.Casefold(username))),
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

export async function updateUserUsernameFromEmail(email:string, username:string) {

    await client.query(
        q.Update(
            q.Select(['ref'], q.Get(q.Match(
                q.Index('users_by_email'), email
            ))),
            {data: {username, caseInsensitiveUsername: q.Casefold(username)}}
        )
    )
}

export async function updateUserImage(id:string, image:{src:string; publicId:string;}) {

    await client.query(
        q.Update(
            q.Ref(q.Collection('users'), id),
            {data: {image}}
        )
    )
}

export async function updateUserFromEmail(email:string, properties:{username?:string;firstName?:string;lastName?:string}) {

    await client.query(
        q.Update(
            q.Select(['ref'], q.Get(q.Match(
                q.Index('users_by_email'), email
            ))),
            {data: {...properties}}
        )
    )
}

export async function getUsernamesAndRefsMatchingSearch(search:string):Promise<{ref:Ref;username:string}[]> {

    const lcSearch = search.toLowerCase()

    return await client.query(
        q.Filter(
            q.Paginate(q.Match(q.Index('all_users_w_username')), {size: 1000000}),
            q.Lambda(['refid', 'username'], q.And(q.Not(q.IsNull(q.Var('username'))) ,q.StartsWith(q.LowerCase(q.Var('username')), lcSearch)))
        )
    )
}

export async function getUsernamesAndRefs():Promise<{ref:Ref;username:string}[]> {

    return await client.query(
        q.Paginate(q.Match(q.Index('all_users_w_username')), {size: 1000000})
    )
}