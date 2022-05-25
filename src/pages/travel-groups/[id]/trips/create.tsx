import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserNotifications } from "../../../../components/hooks/userNotifications";
import { FullGroupNotFound } from "../../../../components/travel-groups/[id]/index/GroupNotFound";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import { getTravelGroup } from "../../../../database/utils/travelGroups";
import { getAuthUser } from "../../../../utils/auth";
import Head from 'next/head'
import MainHeader from '../../../../components/nav/MainHeader'
import MainFooter from '../../../../components/nav/MainFooter'
import Main from '../../../../components/travel-groups/[id]/trips/create/Main'
import styles from '../../../../styles/pages/HeaderFooter.module.css'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function CreateTrip({user, travelGroup}:Props) {

    if (!travelGroup) {
        return <FullGroupNotFound />
    }

    const notifications = useUserNotifications(user.ref['@ref'].id, [travelGroup.ref['@ref'].id])

    return (
        <>
            <Head>
                <title>Create a new Trip | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader notifications={notifications} user={user} />
                <div>
                    <Main user={user} travelGroup={travelGroup} />
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