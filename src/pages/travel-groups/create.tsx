import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ClientUser } from "../../database/interfaces";
import { getAuthUser } from "../../utils/auth";
import Head from 'next/head'
import styles from '../../styles/pages/HeaderFooter.module.css'
import MainHeader from "../../components/nav/MainHeader";
import { getUserTravelGroupDates } from "../../database/utils/travelGroups";
import Main from '../../components/travel-groups/create/Main'

interface Props {
    user: ClientUser;
    travelDates: {start:{'@ts':string};end:{'@ts':string}}[];
}

export default function CreateTravelGroup({user, travelDates}:Props) {

    return (
        <>
            <Head>
                <title>Create Travel Group | Travel Simply</title>     
            </Head> 
            <div className={styles.root}>
                <MainHeader user={user} />
                <div>
                    <Main user={user} travelDates={travelDates} />
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

    const travelDates = (await getUserTravelGroupDates(user.ref.id)).data.map(date => ({start: date[0], end: date[1]}))

    return {props: {
        user: JSON.parse(JSON.stringify(user)),
        travelDates: JSON.parse(JSON.stringify(travelDates))
    }}
}