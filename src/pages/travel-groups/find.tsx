import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getDrawerItems } from "."
import { useUserNotifications } from "../../components/hooks/userNotifications"
import { ClientUser } from "../../database/interfaces"
import { getUserTravelGroups } from "../../database/utils/travelGroups"
import { getAuthUser } from "../../utils/auth"
import Head from 'next/head'
import MainHeader from '../../components/nav/MainHeader'
import MainSidebar from '../../components/nav/MainSidebar'
import Main from '../../components/travel-groups/find/Main'
import { Box } from '@mui/material'
import styles from '../../styles/pages/HeaderSidebarFooter.module.css'
import MainFooter from "../../components/nav/MainFooter"

interface Props {
    user: ClientUser;
}

export default function FindTravelGroup({user}:Props) {

    const drawerItems = getDrawerItems(2)

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>Find a Travel Group | Travel Simply</title>
            </Head>
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications}
                drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar items={drawerItems} breakpoint="md" />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} />
                </Box>
                <MainFooter />
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const {user, redirect} = await getAuthUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {
        user: JSON.parse(JSON.stringify(user)),
    }}
}