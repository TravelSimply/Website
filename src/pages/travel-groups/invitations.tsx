import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getDrawerItems } from "."
import { useUserNotifications } from "../../components/hooks/userNotifications"
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../database/interfaces"
import { getUserTravelGroupInvitationsWithSenderInfo } from "../../database/utils/travelGroupInvitations"
import { getAuthUser } from "../../utils/auth"
import MainHeader from '../../components/nav/MainHeader'
import MainSidebar from '../../components/nav/MainSidebar'
import Head from 'next/head'
import styles from '../../styles/pages/HeaderSidebarFooter.module.css'
import { Box } from "@mui/material"
import Main from '../../components/travel-groups/invites/Main'
import MainFooter from "../../components/nav/MainFooter"

interface Props {
    user: ClientUser;
    invites: ClientTravelGroupInvitationWithSenderInfo[];
}

export default function TravelGroupInvitations({user, invites}:Props) {

    const drawerItems = getDrawerItems(3)

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>Travel Group Invitations | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}}
                notifications={notifications} />
                <MainSidebar items={drawerItems} breakpoint="md" />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} invites={invites} />
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

    try {

        const {data:invites} = await getUserTravelGroupInvitationsWithSenderInfo(user.ref.id)

        console.log('invites', invites)

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            invites: JSON.parse(JSON.stringify(invites))
        }}

    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/'}}
    }
}