import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientTravelGroup, ClientUser } from "../../../database/interfaces";
import { getTravelGroup } from "../../../database/utils/travelGroups";
import { getAuthUser } from "../../../utils/auth";
import styles from '../../../styles/pages/HeaderSidebarFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../components/nav/MainHeader";
import MainSidebar from "../../../components/nav/MainSidebar";
import Main from '../../../components/travel-groups/[id]/index/Main'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function TravelGroup({user, travelGroup}:Props) {

    if (!travelGroup) {
        return (
            <div>
                Hmm... we couldn't find that travel group!
            </div>
        )
    }

    const id = travelGroup.ref['@ref'].id

    const drawerItems = [
        {href: '/travel-groups/[id]', as: `/travel-groups/${id}`, name: 'Overview', selected: true},
        {href: '/travel-groups/[id]/travelers', as: `/travel-groups/${id}/travelers`, name: 'Travelers', selected: false},
        {href: '/travel-groups/[id]/activity', as: `/travel-groups/${id}/activity`, name: 'Activity', selected: false},
        {href: '/travel-groups/[id]/settings', as: `/travel-groups/${id}/settings`, name: 'Settings', selected: false}
    ]

    return (
        <>
            <Head>
                <title>
                    {travelGroup.data.name} | Travel Simply
                </title>
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} drawer={{breakpoint: 'md', items: drawerItems}} />
                <MainSidebar breakpoint="md" items={drawerItems} />
                <div>
                    <Main user={user} travelGroup={travelGroup} />
                </div>
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