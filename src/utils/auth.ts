import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getUserFromEmail } from "./users";

export interface AuthToken {
    email: string;
    name?: string;
    picture?: string;
    sub?: string;
    iat?: string;
}

export async function mustNotBeAuthenticated(ctx:GetServerSidePropsContext) {

    const session = await getSession({req: ctx.req})

    if (!session) return null

    try {
        const user = await getUserFromEmail(session.user?.email)
        
        if (!user) throw 'no user found'

        if (!user.data.username) {
            return {props: {}, redirect: {destination: '/account/setup'}}
        }
    } catch (e) {
        console.log(e)
    }

    return {props: {}, redirect: {destination: '/'}}
}