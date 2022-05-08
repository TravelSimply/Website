import styles from '../../styles/pages/HeaderSidebarFooter.module.css'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getAuthUser } from '../../utils/auth'
import { ClientTravelGroup, ClientUser } from '../../database/interfaces'
import MainHeader from '../../components/nav/MainHeader'
import MainSidebar from '../../components/nav/MainSidebar'
import { Box } from '@mui/material'
import { getUserTravelGroups } from '../../database/utils/travelGroups'
import Main from '../../components/travel-groups/index/Main'
import useSWR from 'swr'
import { useUserNotifications } from '../../components/hooks/userNotifications'

interface Props {
    user: ClientUser;
    travelGroups: ClientTravelGroup[]
}

export default function TravelGroups({user, travelGroups}:Props) {

    const drawerItems = [
        {href: '/travel-groups', name: 'My Travel Groups', selected: true},
        {href: '/travel-groups/create', name: 'Create Travel Group', selected: false},
        {href: '/travel-groups/find', name: 'Find Travel Groups', selected: false}
    ]

    const notifications = useUserNotifications(user.ref['@ref'].id, travelGroups.map(g => g.ref['@ref'].id))

    console.log(notifications)

    return (
        <>
            <Head>
                <title>My Travel Groups | Travel Simply</title>
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar items={drawerItems} breakpoint="md" />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} travelGroups={travelGroups} />
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