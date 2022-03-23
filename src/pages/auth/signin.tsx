import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {getProviders, signIn, getSession, ClientSafeProvider, LiteralUnion } from 'next-auth/react'
import {BuiltInProviderType} from 'next-auth/providers'
import { getUser, getUserFromEmail } from '../../utils/users';
import styles from '../../styles/pages/HeaderOnly.module.css'
import NameOnlyHeader from '../../components/nav/NameOnlyHeader'
import Main from '../../components/auth/signin/Main'

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export default function SignIn({providers}:Props) {
    return (
        <div className={styles.root}>
            <div>
                <NameOnlyHeader />
            </div>
            <div>
                <Main providers={providers} />
            </div>
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const session = await getSession({req: ctx.req})

    if (!session) return {props: {providers: await getProviders()}}

    try {
        const user = await getUserFromEmail(session.user?.email)

        if (!user) throw 'no user found?'

        if (!user.data.username) {
            return {props: {}, redirect: {destination: '/account/setup'}}
        }

    } catch (e) {
        console.log(e)
    }

    return {props: {}, redirect: {destination: '/'}}
}