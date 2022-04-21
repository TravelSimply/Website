import {query as q} from 'faunadb'
import client from '../fauna'
import { ContactInfo } from '../interfaces'

export function getUserContactInfoInnerQuery(userId:string) {
    
    return q.If(
        q.Exists(q.Match(q.Index('contactInfo_by_userId'), userId)),
        q.Get(q.Match(q.Index('contactInfo_by_userId'), userId)),
        q.Create(q.Collection('contactInfo'), {data: {userId}})
    )
}

export async function getUserContactInfo(userId:string):Promise<ContactInfo> {

    return await client.query(
        getUserContactInfoInnerQuery(userId)
    )
}

export async function updateContactInfoInfo(id:string, info:ContactInfo['data']['info']) {

    await client.query(
        q.Update(q.Ref(q.Collection('contactInfo'), id), {data: {info}})
    )
}