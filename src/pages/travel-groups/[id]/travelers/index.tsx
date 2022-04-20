import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import { getTravelGroup } from "../../../../database/utils/travelGroups";
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
    travelGroup: ClientTravelGroup;
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
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar breakpoint="md" items={drawerItems} />
                <Box sx={{gridColumn: {xs: '1 / -1', md: 'auto'}}} >
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