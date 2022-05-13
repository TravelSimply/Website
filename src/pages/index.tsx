import Head from 'next/head'
import Image from 'next/image'
import {signIn} from 'next-auth/react'
import {Button, Box} from '@mui/material'
import {getAuthUser, signOut} from '../utils/auth'
import Link from 'next/link'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ClientUser } from '../database/interfaces'
import styles from '../styles/pages/HeaderFooter.module.css'
import MainHeader from '../components/nav/MainHeader'
import Main from '../components/landing-page/Main'
import { useUserNotifications } from '../components/hooks/userNotifications'

interface Props {
  user: ClientUser;
}

export default function Home({user}:Props) {

    const notifications = user ? useUserNotifications(user.ref['@ref'].id, []) : {raw: null, filtered: null}

    return (
        <>
            <Head>
                <title>Travel Simply</title>
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div>
                    <Main />
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

      return {props: {
          user: JSON.parse(JSON.stringify(user)),
      }}
}