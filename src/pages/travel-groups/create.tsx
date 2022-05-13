import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientPopulatedAvailability, ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import Head from 'next/head'
import styles from '../../styles/pages/HeaderSidebarFooter.module.css'
import MainHeader from "../../components/nav/MainHeader";
import { getUserTravelGroupDates } from "../../database/utils/travelGroups";
import Main from '../../components/travel-groups/create/Main'
import { getAvailabilityAndTravelGroupsOfUser, populateAvailability } from "../../database/utils/availabilities";
import MainSidebar from "../../components/nav/MainSidebar";
import { Box } from "@mui/material";
import {useUserNotifications} from '../../components/hooks/userNotifications'
import { getDrawerItems } from ".";

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
}

export default function CreateTravelGroup({user, availability}:Props) {

    const drawerItems = getDrawerItems(1)

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>Create Travel Group | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}} 
                notifications={notifications} />
                <MainSidebar items={drawerItems} breakpoint="md" />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main user={user} availability={availability} />
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
        const availability = populateAvailability(await getAvailabilityAndTravelGroupsOfUser(user.ref.id))

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            availability: JSON.parse(JSON.stringify(availability)),
        }}
    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}