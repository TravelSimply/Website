import React from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import NameOnlyHeader from '../../../components/nav/NameOnlyHeader'
import styles from '../../../styles/pages/HeaderOnly.module.css'
import EmailSent from '../../../components/auth/verifyemail/EmailSent'
import Verify from '../../../components/auth/verifyemail/Verify'

export default function VerifyEmail() {

    const {query: {token, email}} = useRouter()

    return (
        <>
            <Head>
                Verify Your Email | Travel Simply     
            </Head> 
            <div className={styles.root}>
                <div>
                    <NameOnlyHeader />
                </div>
                <div>
                    {email ? <EmailSent email={email.toString()} /> : token ? <Verify token={token.toString()} /> : ''}
                </div>
            </div>
        </>
    )
}