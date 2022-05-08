import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientContactInfo, ClientPopulatedAvailability, ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import styles from '../../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../components/nav/MainHeader";
import Main from '../../components/account/profile/index/Main'
import { getAvailabilityAndTravelGroupsOfUser, getAvailabilityOfUser, populateAvailability } from "../../database/utils/availabilities";
import { getUserContactInfo } from "../../database/utils/contactInfo";
import { useUserNotifications } from "../../components/hooks/userNotifications";

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability; 
    contactInfo: ClientContactInfo;
}

export default function Profile({user, availability, contactInfo}:Props) {

    const notifications = useUserNotifications(user.ref['@ref'].id, [])

    return (
        <>
            <Head>
                <title>Profile | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} notifications={notifications} />
                <div className={styles.main}>
                    <Main user={user} availability={availability} contactInfo={contactInfo} />
                </div>
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
        // ideally would have availablility and contactInfo gathered
        // in one function for less db calls
        const [availability, contactInfo] = await Promise.all([
            populateAvailability(await getAvailabilityAndTravelGroupsOfUser(user.ref.id)),
            getUserContactInfo(user.ref.id)
        ]) 

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            availability: JSON.parse(JSON.stringify(availability)),
            contactInfo: JSON.parse(JSON.stringify(contactInfo))
        }}
    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}