import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientPopulatedAvailability, ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import styles from '../../styles/pages/HeaderFooter.module.css'
import Head from 'next/head'
import MainHeader from "../../components/nav/MainHeader";
import Main from '../../components/account/profile/index/Main'
import { getAvailabilityAndTravelGroupsOfUser, getAvailabilityOfUser, populateAvailability } from "../../database/utils/availabilities";

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability; 
}

export default function Profile({user, availability}:Props) {

    return (
        <>
            <Head>
                <title>Profile | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} />
                <div className={styles.main}>
                    <Main user={user} availability={availability} />
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

    const availability = populateAvailability(await getAvailabilityAndTravelGroupsOfUser(user.ref.id))

    return {props: {
        user: JSON.parse(JSON.stringify(user)),
        availability: JSON.parse(JSON.stringify(availability))
    }}
}