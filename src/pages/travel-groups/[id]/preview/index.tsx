import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserNotifications } from "../../../../components/hooks/userNotifications";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import { getTravelGroupPreview } from "../../../../database/utils/travelGroups";
import { getAuthUser } from "../../../../utils/auth";
import styles from '../../../../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../../components/nav/MainHeader";
import Main from '../../../../components/travel-groups/[id]/preview/Main'
import Private from "../../../../components/travel-groups/[id]/preview/Private";
import GroupNotFound from "../../../../components/travel-groups/[id]/index/GroupNotFound";
import MainFooter from "../../../../components/nav/MainFooter";

interface Props {
    user: ClientUser;
    travelGroup: 0 | ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
    joinRequests: {'@ref': {id: string}}[];
}

export default function TravelGroupPreview({user, travelGroup, invites, joinRequests}:Props) {

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>
                    Preview {travelGroup ? travelGroup.data.name : 'Travel Group'} | Travel Simply
                </title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div>
                    {travelGroup === 0 ? <Private /> :
                    !travelGroup ? <GroupNotFound /> :
                    <Main user={user} travelGroup={travelGroup} invites={invites} 
                    joinRequests={joinRequests} />
                    }
                </div>
                <MainFooter />
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

        const {travelGroup, invites, joinRequests} = await getTravelGroupPreview(ctx.params.id as string, user.ref.id)

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            travelGroup: JSON.parse(JSON.stringify(travelGroup)),
            invites: JSON.parse(JSON.stringify(invites)),
            joinRequests: JSON.parse(JSON.stringify(joinRequests))
        }}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/'}}
    }
}