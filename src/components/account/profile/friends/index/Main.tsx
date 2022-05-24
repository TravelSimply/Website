import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { ClientFilteredUser, ClientUser } from '../../../../../database/interfaces'
import {PrimarySearchBar} from '../../../../misc/searchBars'
import useSWR, {mutate} from 'swr'
import FriendCard from './FriendCard';
import { OrangePrimaryButton } from '../../../../mui-customizations/buttons';
import Link from 'next/link';
import Snackbar from '../../../../misc/snackbars'
import { matchesAtLeastOneTerm } from '../../../../../utils/search';

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')
    
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [searchFriends, setSearchFriends] = useState<number[]>([])

    const {data:friends, error} = useSWR<ClientUser[]>('/api/users/profile/friends', {revalidateOnFocus: false, 
        revalidateOnReconnect: false, dedupingInterval: 3600000})

    useMemo(() => {
        setSearchFriends(friends?.map((_, i) => i) || [])
    }, [friends])

    useMemo(() => {
        const lcSearch = search.toLowerCase().trim()
        if (!lcSearch) {
            return setSearchFriends(friends?.map((_, i) => i) || [])
        }
        setSearchFriends(friends?.map((friend, i) => {
            if (matchesAtLeastOneTerm(lcSearch, [friend.data.caseInsensitiveUsername, 
            friend.data.firstName, friend.data.lastName])) {
                return i
            }
            return null
        }).filter((val) => val !== null) || [])
    }, [search])

    return (
        <Box maxWidth="md" m={3}>
            <Box mb={3}>
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
            </Box> : !friends || friends.length === 0 ? <Box mt={3}>
                <Box textAlign="center" mx="auto" maxWidth="sm">
                    <Typography variant="h6">
                        No friends here yet!
                    </Typography>
                </Box>
                <Box mt={1} textAlign="center">
                    <Link href="/profile/friends/add">
                        <a>
                            <OrangePrimaryButton>
                                Add Friends
                            </OrangePrimaryButton>
                        </a>
                    </Link>
                </Box>
            </Box> : <Box>
                <Grid container justifyContent="center" spacing={3}>
                    {searchFriends.map((friendIndex) => (
                        <Grid item key={friends[friendIndex]?.ref['@ref'].id || friendIndex}>
                            <FriendCard users={friends} friendIndex={friendIndex} setSnackbarMsg={setSnackbarMsg} />
                        </Grid>
                    ))}
                </Grid>
            </Box>}
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}