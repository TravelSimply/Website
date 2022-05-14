import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientPopulatedAvailability, ClientUser } from "../../../database/interfaces";
import { createAvailability, getAvailabilityAndTravelGroupsOfUser, populateAvailability } from "../../../database/utils/availabilities";
import { getAuthUser } from "../../../utils/auth";
import Head from 'next/head'
import styles from '../../../styles/pages/HeaderFooter.module.css'
import MainHeader from "../../../components/nav/MainHeader";
import Main from '../../../components/account/profile/availability/index/Main'
import { useUserNotifications } from "../../../components/hooks/userNotifications";
import MainFooter from "../../../components/nav/MainFooter";

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
}

export default function Availability({user, availability}:Props) {

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>My Availability | Travel Simply</title>
            </Head>
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div>
                    <Main availability={availability} />
                </div>
                <MainFooter />
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