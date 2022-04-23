import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientTravelGroup, ClientTravelGroupWithPopulatedTravellersAndContactInfo, ClientUser } from "../../../../database/interfaces";
import { getTravelGroup, getTravelGroupWithPopulatedTravellersAndContactInfo } from "../../../../database/utils/travelGroups";
import { getAuthUser } from "../../../../utils/auth";
import styles from '../../../../styles/pages/HeaderSidebarFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../../components/nav/MainHeader";
import MainSidebar from "../../../../components/nav/MainSidebar";
import Main from '../../../../components/travel-groups/[id]/travellers/Main'
import {getDrawerItems} from '../index'
import {Box} from '@mui/material'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroupWithPopulatedTravellersAndContactInfo;
}

export default function Travelers({user, travelGroup}:Props) {

    if (!travelGroup) {
        return (
            <div>
                Hmm... we couldn't find that travel group!
            </div>
        )
    }

    const drawerItems = getDrawerItems(travelGroup, 1)

    return (
        <>
            <Head>
                <title>Travelers | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'lg', items: drawerItems}} />
                <MainSidebar breakpoint="lg" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', lg: 'auto'}}} >
                    <Main user={user} travelGroup={travelGroup} />
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

        const travelGroup = await getTravelGroupWithPopulatedTravellersAndContactInfo(id, user)

        if (travelGroup === 0) {
            throw 'User not in travel group'
        }

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            travelGroup: JSON.parse(JSON.stringify(travelGroup))
        }}

    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/'}}
    }
}