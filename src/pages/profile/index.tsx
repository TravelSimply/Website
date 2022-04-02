import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import styles from '../../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../components/nav/MainHeader";
import Main from '../../components/account/profile/index/Main'

interface Props {
    user: ClientUser;
}

export default function Profile({user}:Props) {

    return (
        <>
            <Head>
                <title>Profile | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} />
                <div className={styles.main}>
                    <Main user={user} />
                </div>
                <div>
                    footer
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