import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientTravelGroup, ClientTravelGroupWithPopulatedTravellersAndContactInfo, ClientUser } from "../../../database/interfaces";
import { getTravelGroup } from "../../../database/utils/travelGroups";
import { getAuthUser } from "../../../utils/auth";
import styles from '../../../styles/pages/HeaderSidebarFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../components/nav/MainHeader";
import MainSidebar from "../../../components/nav/MainSidebar";
import Main from '../../../components/travel-groups/[id]/index/Main'
import {Box} from '@mui/material'
import { useUserNotifications } from "../../../components/hooks/userNotifications";
import { FullGroupNotFound } from "../../../components/travel-groups/[id]/index/GroupNotFound";
import MainFooter from "../../../components/nav/MainFooter";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export function getDrawerItems(travelGroup:ClientTravelGroup | ClientTravelGroupWithPopulatedTravellersAndContactInfo,
     selected:number) {
    const id = travelGroup.ref['@ref'].id

    return [
        {href: '/travel-groups/[id]', as: `/travel-groups/${id}`, name: 'Overview', selected: selected == 0},
        {href: '/travel-groups/[id]/travelers', as: `/travel-groups/${id}/travelers`, name: 'Travelers', selected: selected == 1},
        {href: '/travel-groups/[id]/activity', as: `/travel-groups/${id}/activity`, name: 'Activity', selected: selected == 2},
        {href: '/travel-groups/[id]/settings', as: `/travel-groups/${id}/settings`, name: 'Settings', selected: selected == 3}
    ]
}

export default function TravelGroup({user, travelGroup}:Props) {

    if (!travelGroup) {
        return (
            <FullGroupNotFound />
        )
    }

    const drawerItems = getDrawerItems(travelGroup, 0)

    const notifications = useUserNotifications(user.ref['@ref'].id, [travelGroup.ref['@ref'].id])

    return (
        <>
            <Head>
                <title>
                    {travelGroup.data.name} | Travel Simply
                </title>
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}}
                notifications={notifications} />
                <MainSidebar breakpoint="md" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} travelGroup={travelGroup} />
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

        if (redirect) {
            return redirect
        }

        const id = ctx.params.id as string

        const travelGroup = await getTravelGroup(id)

        if (travelGroup && !travelGroup.data.members.includes(user.ref.id)) {
            throw 'User not in travel group'
        }

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            travelGroup: JSON.parse(JSON.stringify(travelGroup))
        }}

    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}