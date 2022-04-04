import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { ClientPopulatedToFriendRequest, ClientUser } from "../../../../../database/interfaces";
import { PrimarySearchBar } from "../../../../misc/searchBars";
import { OrangeDensePrimaryButton, OrangePrimaryButton } from "../../../../mui-customizations/buttons";
import InviteCard from "../InviteCard";
import Snackbar from '../../../../misc/snackbars'

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const [search, setSearch] = useState('')
    const [searchedInvites, setSearchedInvites] = useState<ClientPopulatedToFriendRequest[]>([])
    
    const [loading, setLoading] = useState<boolean[]>([])
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const {data:invites, error} = useSWR<ClientPopulatedToFriendRequest[]>('/api/users/profile/friends/requests-sent', {revalidateOnFocus: false, 
        revalidateOnReconnect: false})
    
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
            if (invite.data.to.data.caseInsensitiveUsername.includes(lcSearch)) {
                return true
            }
            if (invite.data.to.data.firstName.toLowerCase().includes(lcSearch)) {
                return true
            }
            if (invite.data.to.data.lastName.toLowerCase().includes(lcSearch)) {
                return true
            }
            return false
        }))
    }, [search])

    useMemo(() => {
        setLoading(searchedInvites.map(inv => false))
    }, [searchedInvites])

    const rescindInvite = async (id:string, i:number) => {

        const loadingCopy = [...loading]
        loadingCopy[i] = true
        setLoading(loadingCopy)

        try {

            await axios({
                method: 'POST',
                url: '/api/users/profile/friends/interact-request',
                data: {
                    operation: 'rescind',
                    id
                }
            })

            mutate('/api/users/profile/friends/requests-sent', invites.filter(inv => inv.ref['@ref'].id !== id), false)
            setSnackbarMsg({type: 'success', content: 'Rescinded Invite Successfully'})
        } catch (e) {
            loadingCopy[i] = false
            setLoading(loadingCopy)
            setSnackbarMsg({type: 'error', content: 'Failed to Rescind Invite'})
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
                        <Grid item key={invite.data.to.data.username}>
                            <InviteCard user={invite.data.to} timeSent={invite.data.timeSent['@ts']}>
                                <Box mx={-3} pl={3} py={1} bgcolor="orangeBg.light">
                                    <Box>
                                        <OrangeDensePrimaryButton disabled={loading[i]} onClick={() => rescindInvite(invite.ref['@ref'].id, i)}>
                                            Rescind Invitation
                                        </OrangeDensePrimaryButton>
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