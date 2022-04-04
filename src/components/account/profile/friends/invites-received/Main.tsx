import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { ClientPopulatedFromFriendRequest, ClientPopulatedToFriendRequest, ClientUser } from "../../../../../database/interfaces";
import { PrimarySearchBar } from "../../../../misc/searchBars";
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton, OrangePrimaryButton, OrangeSecondaryButton } from "../../../../mui-customizations/buttons";
import InviteCard from "../InviteCard";
import Snackbar from '../../../../misc/snackbars'

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')
    const [searchedInvites, setSearchedInvites] = useState<ClientPopulatedFromFriendRequest[]>([])
    
    const [loading, setLoading] = useState<boolean[]>([])
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const {data:invites, error} = useSWR<ClientPopulatedFromFriendRequest[]>('/api/users/profile/friends/requests-received', 
    {revalidateOnFocus: false, revalidateOnReconnect: false})
    
    useMemo(() => {
        if (!invites) return
        setSearchedInvites(invites)
    }, [invites])

    useMemo(() => {
        const lcSearch = search.toLowerCase().trim()
        if (!invites) return
        if (!lcSearch) {
            return setSearchedInvites(invites)
        }
        setSearchedInvites(invites.filter(invite => {
            if (invite.data.from.data.caseInsensitiveUsername.includes(lcSearch)) {
                return true
            }
            if (invite.data.from.data.firstName.toLowerCase().includes(lcSearch)) {
                return true
            }
            if (invite.data.from.data.lastName.toLowerCase().includes(lcSearch)) {
                return true
            }
            return false
        }))
    }, [search])

    useMemo(() => {
        setLoading(searchedInvites.map(inv => false))
    }, [searchedInvites])

    const acceptFriendRequest = async (id:string, i:number) => {
        const loadingCopy = [...loading]
        loadingCopy[i] = true
        setLoading(loadingCopy)

        try {

            await axios ({
                method: 'POST',
                url: '/api/users/profile/friends/interact-request',
                data: {operation: 'accept', id}
            })

            mutate('/api/users/profile/friends/requests-received', invites.filter(inv => inv.ref['@ref'].id !== id), false)
            setSnackbarMsg({type: 'success', content: 'Friend Added!'})
        } catch (e) {
            loadingCopy[i] = false
            setLoading(loadingCopy)
            setSnackbarMsg({type: 'error', content: 'Failed to Accept Invite'})
        }
    }

    const rejectFriendRequest = async (id:string, i:number) => {
        const loadingCopy = [...loading]
        loadingCopy[i] = true
        setLoading(loadingCopy)

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/interact-request',
                data: {operation: 'reject', id}
            })

            mutate('/api/users/profile/friends/requests-received', invites.filter(inv => inv.ref['@ref'].id !== id), false)
            setSnackbarMsg({type: 'success', content: 'Invite Rejected'})
        } catch (e) {
            loadingCopy[i] = false
            setLoading(loadingCopy)
            setSnackbarMsg({type: 'error', content: 'Failed to Reject Invite'})
        }
    }

    return (
        <Box maxWidth="md" m={3}>
            <Box mb={3}>
                <Container maxWidth="sm">
                    <PrimarySearchBar search={search} setSearch={setSearch} />
                </Container>
            </Box>
            {error ? <Box textAlign="center" mt={3}>
                Error loading invites, retrying... 
            </Box> : !invites && searchedInvites.length === 0 ? <Box mt={3}>
                <Box mx="auto" textAlign="center">
                    <CircularProgress />
                </Box> 
            </Box> : !invites|| invites.length === 0 ? <Box mt={3}>
                <Box textAlign="center" mx="auto" maxWidth="sm">
                    <Typography variant="h6">
                        No invites here!
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
                    {searchedInvites.map((invite, i) => (
                        <Grid item key={invite.data.from.data.username}>
                            <InviteCard user={invite.data.from} timeSent={invite.data.timeSent['@ts']}>
                                <Box mx={-3} pl={3} py={1} bgcolor="orangeBg.light">
                                    <Box>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <OrangeDensePrimaryButton disabled={loading[i]} 
                                                onClick={() => acceptFriendRequest(invite.ref['@ref'].id, i)}>
                                                    Accept
                                                </OrangeDensePrimaryButton>
                                            </Grid>
                                            <Grid item>
                                                <OrangeDenseSecondaryButton disabled={loading[i]}
                                                onClick={() => rejectFriendRequest(invite.ref['@ref'].id, i)}>
                                                    Reject
                                                </OrangeDenseSecondaryButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </InviteCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>}
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}