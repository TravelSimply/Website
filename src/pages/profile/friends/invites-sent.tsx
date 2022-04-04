import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientUser } from "../../../database/interfaces";
import { getAuthUser } from "../../../utils/auth";
import styles from '../../../styles/pages/HeaderSidebarFooter.module.css'
import MainHeader from '../../../components/nav/MainHeader'
import MainSidebar from '../../../components/nav/MainSidebar'
import {Box} from '@mui/material'
import Head from 'next/head'
import Main from '../../../components/account/profile/friends/invites-sent/Main'

interface Props {
    user: ClientUser;
}

export default function Friends({user}:Props) {

    const drawerItems = [
        {href: '/profile/friends', name: 'Friends', selected: false},
        {href: '/profile/friends/add', name: 'Add Friends', selected: false},
        {href: '/profile/friends/invites-received', name: 'Invites Received', selected: false},
        {href: '/profile/friends/invites-sent', name: 'Invites Sent', selected: true}
    ]

    return (
        <>
            <Head>
                <title>Friends Invites Sent | Travel Simply</title> 
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{items: drawerItems, breakpoint: 'sm'}} />
                <MainSidebar breakpoint="sm" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', sm: 'auto'}}} >
                    <Main user={user} />
                </Box>
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