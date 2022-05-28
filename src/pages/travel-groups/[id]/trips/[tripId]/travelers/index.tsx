import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { getDrawerItems } from "..";
import { useUserNotifications } from "../../../../../../components/hooks/userNotifications";
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";
import { getTripWithTravelGroupNameAndMembers } from "../../../../../../database/utils/trips";
import { getAuthUser } from "../../../../../../utils/auth";
import styles from '../../../../../../styles/pages/HeaderSidebarFooter.module.css'
import MainHeader from '../../../../../../components/nav/MainHeader'
import MainFooter from '../../../../../../components/nav/MainFooter'
import MainSidebar from "../../../../../../components/nav/MainSidebar";
import { Box } from "@mui/material";
import Main from '../../../../../../components/travel-groups/[id]/trips/[tripId]/travellers/Main'

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function Travelers({user, trip}:Props) {
    
    if (!trip) {
        return <div>trip not found</div>
    }

    const drawerItems = getDrawerItems(trip.ref['@ref'].id, trip.data.travelGroup.id, 1)

    const notifications = useUserNotifications(user.ref['@ref'].id, [trip.data.travelGroup.id])

    return (
        <>
            <Head>
                <title>
                    Trip Travelers | Travel Simply     
                </title>   
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} 
                drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar breakpoint="md" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} trip={trip} />
                </Box>
                <Box sx={{gridColumn: '1 / -1'}}>
                    <MainFooter />
                </Box>
            </div>
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    try {

        const {user, redirect} = await getAuthUser(ctx)

        if (redirect) return redirect

        const trip = await getTripWithTravelGroupNameAndMembers(ctx.params.id as string, ctx.params.tripId as string)

        if (trip && !trip.data.travelGroup.members.includes(user.ref.id)) {
            throw 'User not in Travel Group'
        }

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            trip: JSON.parse(JSON.stringify(trip))
        }}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/'}}
    }
}