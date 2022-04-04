import React, {useState} from 'react'
import {Box, Alert, AlertTitle, Collapse, IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import {OrangeDensePrimaryButton, OrangePrimaryButton, OrangeSecondaryButton} from '../../mui-customizations/buttons'
import FriendAdder from '../profile/FriendAdder'
import { ClientUser } from '../../../database/interfaces'
import axios from 'axios'
import Router from 'next/router'

interface Props {
    user: ClientUser;
}

export default function Friends({user}:Props) {

    const [friends, setFriends] = useState([])
    const [startingAddList, setStartingAddList] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const [showAlert, setShowAlert] = useState(true)

    const nextClick = async () => {
        setSubmitting(true)

        const ids = friends.map(friend => friend.ref['@ref'].id)

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/request',
                data: {ids}
            })

            Router.push({pathname: '/dashboard'})
        } catch (e) {
            setSubmitting(false)
        }
    }

    const getGoogleContacts = async () => {

        setSubmitting(true)

        try {

            const {data} = await axios({
                method: 'POST',
                url: '/api/users/profile/friends/setup/google',
                data: {}
            })

            setStartingAddList(data.friends)
            setShowAlert(false)
        } catch (e) {
            console.log(e)
        }

        setSubmitting(false)
    }

    return (
        <Box minHeight="60vh" display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
                {user.data.oAuthIdentifier?.google && <Box mb={3}>
                    <Collapse in={showAlert}>
                        <Alert severity='info' action={<IconButton size="small" onClick={() => setShowAlert(false)}>
                            <CloseIcon />
                        </IconButton>}>
                            <AlertTitle>Search for Google contacts on Travel Simply?</AlertTitle>
                            <OrangeDensePrimaryButton disabled={submitting} onClick={() => getGoogleContacts()}>
                                Search
                            </OrangeDensePrimaryButton>
                        </Alert>
                    </Collapse>
                </Box>}
                <Box mb={3}>
                    <Box maxWidth={400} mx="auto">
                        <FriendAdder startingAddList={startingAddList} setAddedFriends={setFriends} />
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