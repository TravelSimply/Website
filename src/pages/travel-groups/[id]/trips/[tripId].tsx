import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../database/interfaces"
import { getTripWithTravelGroupNameAndMembers } from "../../../../database/utils/trips"
import { getAuthUser } from "../../../../utils/auth"
import Head from 'next/head'
import styles from '../../../../styles/pages/HeaderSidebarFooter.module.css'
import MainHeader from '../../../../components/nav/MainHeader'
import MainFooter from '../../../../components/nav/MainFooter'
import { useUserNotifications } from "../../../../components/hooks/userNotifications"
import MainSidebar from "../../../../components/nav/MainSidebar"
import { Box } from "@mui/material"
import Main from '../../../../components/travel-groups/[id]/trips/[tripId]/index/Main'

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export function getDrawerItems(tripId:string, travelGroupId:string, selected:number) {

    return [
        {href: '/travel-groups/[id]/trips/[tripId]', as: `/travel-groups/${travelGroupId}/trips/${tripId}`, name: 'Overview', selected: selected === 0},
        {href: '/travel-groups/[id]/trips/[tripId]/travelers', as: `/travel-groups/${travelGroupId}/trips/${tripId}/travelers`, name: 'Travelers', selected: selected === 1},
        {href: '/travel-groups/[id]/trips/[tripId]/proposal-board', as: `/travel-groups/${travelGroupId}/trips/${tripId}/proposal-board`, name: 'Proposal Board', selected: selected === 2},
        {href: '/travel-groups/[id]/trips/[tripId]/itinerary', as: `/travel-groups/${travelGroupId}/trips/${tripId}/itinerary`, name: 'Itinerary', selected: selected === 3},
        {href: '/travel-groups/[id]/trips/[tripId]/logistics', as: `/travel-groups/${travelGroupId}/trips/${tripId}/logistics`, name: 'Logistics', selected: selected === 4}
    ]
}

export default function Trip({user, trip}:Props) {

    if (!trip) {
        return (
            <div>trip not found</div>
        )
    }

    const drawerItems = getDrawerItems(trip.ref['@ref'].id, trip.data.travelGroup.id, 0)

    const notifications = useUserNotifications(user.ref['@ref'].id, [trip.data.travelGroup.id])

    return (
        <>
            <Head>
                <title>Trip Overview | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}}
                notifications={notifications} />
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