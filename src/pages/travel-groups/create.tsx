import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientPopulatedAvailability, ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import Head from 'next/head'
import styles from '../../styles/pages/HeaderFooter.module.css'
import MainHeader from "../../components/nav/MainHeader";
import { getUserTravelGroupDates } from "../../database/utils/travelGroups";
import Main from '../../components/travel-groups/create/Main'
import { getAvailabilityAndTravelGroupsOfUser, populateAvailability } from "../../database/utils/availabilities";

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
}

export default function CreateTravelGroup({user, availability}:Props) {

    return (
        <>
            <Head>
                <title>Create Travel Group | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} />
                <div>
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