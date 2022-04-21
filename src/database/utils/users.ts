import client from '../fauna'
import {query as q} from 'faunadb'
import { Ref, User, VerificationToken } from '../interfaces'
import {Profile} from 'next-auth'

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

export async function createUserFromGoogle({email, name, picture}:Profile, identifier:string ) {
    const [firstName, lastName] = name.split(' ')

    const user:User = await client.query(
        q.Create(q.Collection('users'), {data: {
            email,
            firstName,
            lastName,
            image: {src: picture},
            status: [],
            oAuthIdentifier: {google: identifier}
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

export async function getUserFromGoogle(id:string):Promise<User> {

    return await client.query(
        q.Let(
            {ref: q.Match(q.Index('users_by_googleIdentifier'), id)}, 
            q.If(
                q.Exists(q.Var('ref')),
                q.Get(q.Var('ref')),
                null
            )
        )
    )
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

export async function getUsersWithEmails(emails:string[]):Promise<{data:User[]}> {
    
    return await client.query(q.Map(
        q.Paginate(q.Union(...emails.map(email => q.Match(q.Index('users_by_email'), email)))),
        q.Lambda("ref",
            q.If(
                q.Exists(q.Var('ref')),
                q.Get(q.Var('ref')),
                null
            )
        )
    ))
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

export async function updateUserFromEmail(email:string, 
    properties:{username?:string;firstName?:string;lastName?:string;caseInsensitiveUsername?:any}) {

    if (properties.username) {
        properties.caseInsensitiveUsername = q.Casefold(properties.username)
    }

    await client.query(
        q.Update(
            q.Select(['ref'], q.Get(q.Match(
                q.Index('users_by_email'), email
            ))),
            {data: {...properties}}
        )
    )
}

export async function updateUser(id:string, 
    properties:{username?:string;firstName?:string;lastName?:string;caseInsensitiveUsername?:any}) {

    if (properties.username) {
        properties.caseInsensitiveUsername = q.Casefold(properties.username)
    }

    await client.query(
        q.Update(
            q.Ref(q.Collection('users'), id),
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

export function filterUser(user:User) {

    return {...user, data: {...user.data, password: null}}
}

export function filterUsers(users:User[]) {

    return users.map(user => filterUser(user))
}


function insertData(d:string) {
    return q.If(
        q.ContainsField(d, q.Select('data', q.Var('user'))),
        q.Select(['data', d], q.Var('user')),
        null 
    )
}

function selectAllUserData() {
    return {
        username: insertData('username'),
        caseInsensitiveUsername: insertData('caseInsensitiveUsername'),
        password: insertData('password'),
        firstName: insertData('firstName'),
        lastName: insertData('lastName'),
        email: insertData('email'),
        image: insertData('image'),
        friends: insertData('friends'),
        oAuthIdentifier: insertData('oAuthIdentifier')
    } 
}

export function populateUserWithContactInfo() {
    return {
        ref: q.Select('ref', q.Var('user')),
        data: {
            ...selectAllUserData(),
            contactInfo: q.If(
                q.Exists(q.Match(q.Index('contactInfo_by_userId'), q.Select(['ref', 'id'], q.Var('user')))),
                q.Get(q.Match(q.Index('contactInfo_by_userId'), q.Select(['ref', 'id'], q.Var('user')))),
                null
            )
        }
    }
}