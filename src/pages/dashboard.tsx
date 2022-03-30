import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React from 'react'
import { User } from '../database/interfaces'
import { getAuthUser } from '../utils/auth';

interface Props {
    user: User;
}

export default function Dashboard({user}:Props) {

    return (
        <div>
            {user.data.toString()}
        </div>
    )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {

    const {user, redirect} = await getAuthUser(ctx)

    if (redirect) {
        return redirect
    }

    return {props: {user: JSON.parse(JSON.stringify(user))}}
}