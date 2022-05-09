import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../database/interfaces"
import { getUserTravelGroupInvitationsWithSenderInfo } from "../../database/utils/travelGroupInvitations"
import { getAuthUser } from "../../utils/auth"

interface Props {
    user: ClientUser;
    invites: ClientTravelGroupInvitationWithSenderInfo[];
}

export default function TravelGroupInvitations({user, invites}:Props) {

    console.log(invites)

    return (
        <div>
            hello world
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const {user, redirect} = await getAuthUser(ctx)

    if (redirect) {
        return redirect
    }

    try {

        const {data:invites} = await getUserTravelGroupInvitationsWithSenderInfo(user.ref.id)

        console.log('invites', invites)

        return {props: {
            user: JSON.parse(JSON.stringify(user)),
            invites: JSON.parse(JSON.stringify(invites))
        }}

    } catch (e) {
        return {props: {}, redirect: {destination: '/'}}
    }
}