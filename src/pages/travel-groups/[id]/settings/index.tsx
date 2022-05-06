import { getDrawerItems } from "..";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import styles from '../../../../styles/pages/HeaderSidebarFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../../components/nav/MainHeader";
import MainSidebar from "../../../../components/nav/MainSidebar";
import Main from '../../../../components/travel-groups/[id]/settings/Main'
import {Box} from '@mui/material'
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getAuthUser } from "../../../../utils/auth";
import { getTravelGroup } from "../../../../database/utils/travelGroups";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export default function TravelGroupSettings({travelGroup, user}:Props) {

    if (!travelGroup) {
        return (
            <div>
                Hmm... we couldn't find that travel group!
            </div>
        )
    }

    const drawerItems = getDrawerItems(travelGroup, 3)

    return (
        <>
            <Head>
                <title>
                    Settings | Travel Simply
                </title>
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar breakpoint="md" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
                    <Main travelGroup={travelGroup} user={user} />
                </Box>
                <div>
                    footer
                </div>
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

        if (!travelGroup.data.members.includes(user.ref.id)) {
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