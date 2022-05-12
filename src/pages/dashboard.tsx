import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React from 'react'
import { ClientTravelGroup, ClientUser, User } from '../database/interfaces'
import { getAuthUser } from '../utils/auth';
import styles from '../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from '../components/nav/MainHeader'
import Main from '../components/dashboard/Main'
import { getUserTravelGroups } from '../database/utils/travelGroups';
import { useUserNotifications } from '../components/hooks/userNotifications';

interface Props {
    user: ClientUser;
    travelGroups: ClientTravelGroup[];
}

export default function Dashboard({user, travelGroups}:Props) {

    const notifications = useUserNotifications(user.ref['@ref'].id, travelGroups.map(g => g.ref['@ref'].id))

    return (
        <>
            <Head>
                <title>Dashboard | Spanish Bites</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div>
                    <Main user={user} travelGroups={travelGroups} notifications={notifications} />
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

    try {

        const travelGroups = await getUserTravelGroups(user.ref.id)

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            travelGroups: JSON.parse(JSON.stringify(travelGroups.data))
        }}

    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}