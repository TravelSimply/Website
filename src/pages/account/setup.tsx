import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React from 'react'
import { ClientUser, User } from '../../database/interfaces'
import { getNotSetupAuthUser } from '../../utils/auth';
import styles from '../../styles/pages/HeaderOnly.module.css'
import Head from 'next/head'
import NameOnlyHeader from '../../components/nav/NameOnlyHeader'
import Main from '../../components/account/setup/Main'

interface Props {
    user: ClientUser;
}

export default function Setup({user}:Props) {

    return (
        <>
            <Head>
                <title>Setup Your Account | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <div>
                    <NameOnlyHeader />
                </div>
                <div>
                    <Main user={user} />
                </div>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const {user, redirect} = await getNotSetupAuthUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {user: JSON.parse(JSON.stringify(user))}}
}