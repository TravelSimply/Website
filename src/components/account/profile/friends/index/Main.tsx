import { Box, CircularProgress, Container, Typography } from '@mui/material';
import React, { useState } from 'react'
import { ClientUser } from '../../../../../database/interfaces'
import {PrimarySearchBar} from '../../../../misc/searchBars'
import useSWR from 'swr'

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')

    const [searchFriends, setSearchFriends] = useState([])

    const {data:friends, error} = useSWR('/api/users/profile/friends/all', {revalidateOnFocus: false, 
        revalidateOnReconnect: false})

    console.log(friends)

    return (
        <Box maxWidth="md" m={3}>
            <Box>
                <Container maxWidth="sm">
                    <PrimarySearchBar search={search} setSearch={setSearch} />
                </Container>
            </Box>
            {error ? <Box textAlign="center" mt={3}>
                Error loading friends, retrying... 
            </Box> : !friends && searchFriends.length === 0 ? <Box mt={3}>
                <Box mx="auto" textAlign="center">
                    <CircularProgress />
                </Box> 
            </Box> : friends.length === 0 ? <Box mt={3}>
                <Box textAlign="center" mx="auto" maxWidth="sm">
                    <Typography variant="h6">
                        Search for friends to add!
                    </Typography>
                </Box>
            </Box> : <Box>
                here are the friends 
            </Box>}
        </Box>
    )
}