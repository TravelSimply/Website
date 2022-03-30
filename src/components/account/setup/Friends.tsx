import React, {useState} from 'react'
import {Box} from '@mui/material'
import {OrangePrimaryButton} from '../../mui-customizations/buttons'
import FriendAdder from '../profile/FriendAdder'
import { ClientUser } from '../../../database/interfaces'
import axios from 'axios'
import Router from 'next/router'

interface Props {
    user: ClientUser;
}

export default function Friends({user}:Props) {

    const [friends, setFriends] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const nextClick = async () => {
        setSubmitting(true)

        const emails = friends.map(friend => friend.data.email)

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/request',
                data: {emails}
            })

            Router.push({pathname: '/dashboard'})
        } catch (e) {
            setSubmitting(false)
        }
    }

    return (
        <Box minHeight="60vh" display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
                <Box mb={3}>
                    <Box maxWidth={400} mx="auto">
                        <FriendAdder user={user} currentFriends={[]} setAddedFriends={setFriends} />
                    </Box>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center">
                <Box minWidth={200}>
                    <OrangePrimaryButton onClick={() => nextClick()} disabled={submitting} fullWidth>
                        Finish 
                    </OrangePrimaryButton>
                </Box>
            </Box>
        </Box>
    )
}