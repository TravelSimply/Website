import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserNotifications } from "../../../../components/hooks/userNotifications";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import { getTravelGroupPreview } from "../../../../database/utils/travelGroups";
import { getAuthUser } from "../../../../utils/auth";
import styles from '../../../../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../../../components/nav/MainHeader";
import Main from '../../../../components/travel-groups/[id]/preview/Main'

interface Props {
    user: ClientUser;
    travelGroup: 0 | ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
}

export default function TravelGroupPreview({user, travelGroup, invites}:Props) {

    console.log('invites', invites)

    if (travelGroup === 0) {
        return (
            <div>
                This travel group is private. To preview it, you need to be invited first.
            </div>
        )
    }

    if (!travelGroup) {
        return (
            <div>
                Hmm... we couldn't find that travel group!
            </div>
        )
    }

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>
                    Preview {travelGroup.data.name} | Travel Simply
                </title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div>
                    <Main user={user} travelGroup={travelGroup} invites={invites} />
                </div>
                <div>
                    Footer
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

        const {travelGroup, invites} = await getTravelGroupPreview(ctx.params.id as string, user.ref.id)

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            travelGroup: JSON.parse(JSON.stringify(travelGroup)),
            invites: JSON.parse(JSON.stringify(invites))
        }}
    } catch (e) {
        console.log(e)
        return {props: {}, redirect: {destination: '/'}}
    }
}