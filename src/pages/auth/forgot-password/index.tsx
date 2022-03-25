import React from 'react'
import Head from 'next/head'
import styles from '../../../styles/pages/HeaderOnly.module.css'
import NameOnlyHeader from '../../../components/nav/NameOnlyHeader'
import Main from '../../../components/auth/forgotpassword/Main'
import Verify from '../../../components/auth/forgotpassword/Verify'
import {useRouter} from 'next/router'

export default function ForgotPassword() {

    const {query: {token}} = useRouter()

    return (
        <>
            <Head>
                <title>Reset Your Password | Travel Simply</title> 
            </Head> 
            <div className={styles.root}>
                <div>
                    <NameOnlyHeader />
                </div>
                <div>
                    {token ? <Verify token={token.toString()} /> : <Main />}
                </div>
            </div>
        </>
    )
}