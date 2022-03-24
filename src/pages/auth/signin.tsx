import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {getProviders, signIn, getSession, ClientSafeProvider, LiteralUnion } from 'next-auth/react'
import {BuiltInProviderType} from 'next-auth/providers'
import { getUser, getUserFromEmail } from '../../utils/users';
import styles from '../../styles/pages/HeaderOnly.module.css'
import NameOnlyHeader from '../../components/nav/NameOnlyHeader'
import Main from '../../components/auth/signin/Main'
import { mustNotBeAuthenticated } from '../../utils/auth';
import Head from 'next/head'

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export default function SignIn({providers}:Props) {
    return (
        <>
            <Head>
                <title>Sign in | Travel Simply</title>
            </Head>
            <div className={styles.root}>
                <div>
                    <NameOnlyHeader />
                </div>
                <div>
                    <Main providers={providers} />
                </div>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const redirect = await mustNotBeAuthenticated(ctx)

    if (!redirect) {
        return {props: {providers: await getProviders()}}
    }

    return redirect
}