import { Alert, AlertTitle, Box, CircularProgress, Collapse, Container, IconButton } from '@mui/material'
import React, {useMemo, useState} from 'react'
import { ClientUser } from '../../../../../database/interfaces'
import FriendAdder from '../../FriendAdder'
import CloseIcon from '@mui/icons-material/Close'
import { OrangeDensePrimaryButton, OrangePrimaryButton } from '../../../../mui-customizations/buttons'
import useSWR from 'swr'
import axios from 'axios'
import Snackbar from '../../../../misc/snackbars'

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [addedFriends, setAddedFriends] = useState<ClientUser[]>([])
    const [startingAddList, setStartingAddList] = useState<ClientUser[]>([])

    const [alert, setAlert] = useState('')

    const {data:requestIds} = useSWR<{to:string[];from:string[]}>('/api/users/profile/friends/requests/all', {revalidateOnFocus: false, 
        revalidateOnReconnect: false})

    useMemo(() => {
        if (!requestIds) {
            return setStartingAddList([])
        }
        const addedUser = addedFriends[addedFriends.length - 1]

        if (!addedUser) return
        
        if (addedUser.data.username === user.data.username) {
            setAlert('You cannot friend yourself!')
            return setStartingAddList(addedFriends.slice(0, -1))
        }
        if (requestIds.to.includes(addedUser.ref['@ref'].id)) {
            setAlert(`You have already sent @${addedUser.data.username} an invite!`)
            return setStartingAddList(addedFriends.slice(0, -1))
        }
        if (requestIds.from.includes(addedUser.ref['@ref'].id)) {
            setAlert(`@${addedUser.data.username} has already sent you an invite!`)
            return setStartingAddList(addedFriends.slice(0, -1))
        }
        if (user.data.friends?.includes(addedUser.ref['@ref'].id)) {
            setAlert(`@${addedUser.data.username} is already a friend!`)
            return setStartingAddList(addedFriends.slice(0, -1))
        }
        
    }, [addedFriends])

    const addFriends = async () => {
        setLoading(true)

        const ids = addedFriends.map(friend => friend.ref['@ref'].id)

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/request',
                data: {ids}
            })

            setSnackbarMsg({type: 'success', content: 'Invites Sent Successfully'})
            setStartingAddList([])
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Adding Friends'})
        }

        setLoading(false)
    }

    return (
        <Box maxWidth="md" m={3}>
            <Container maxWidth="sm">
                {!requestIds ? <Box textAlign="center">
                    <CircularProgress />
                </Box> :
                <FriendAdder setAddedFriends={setAddedFriends} 
                startingAddList={startingAddList}>
                    {alert && <Box mt={1}>
                        <Collapse in={Boolean(alert)}>
                            <Alert severity='info' action={<IconButton size="small" onClick={() => setAlert('')}>
                                <CloseIcon />
                            </IconButton>}>
                                <AlertTitle>{alert}</AlertTitle>
                            </Alert>
                        </Collapse>
                    </Box>}
                </FriendAdder>}
                {addedFriends.length > 0 && <Box mt={2}>
                    <Box maxWidth={200} mx="auto">
                        <OrangePrimaryButton disabled={loading} fullWidth onClick={() => addFriends()}>
                            Add Friends
                        </OrangePrimaryButton>
                    </Box>
                </Box>}
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}