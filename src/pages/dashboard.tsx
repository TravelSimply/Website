import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React from 'react'
import { ClientUser, User } from '../database/interfaces'
import { getAuthUser } from '../utils/auth';
import styles from '../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from '../components/nav/MainHeader'

interface Props {
    user: ClientUser;
}

export default function Dashboard({user}:Props) {

    return (
        <>
            <Head>
                <title>Dashboard | Spanish Bites</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} />
                <div>
                    main section
                </div>
                <div>
                    Footer
                </div>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const {user, redirect} = await getAuthUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {user: JSON.parse(JSON.stringify(user))}}
}