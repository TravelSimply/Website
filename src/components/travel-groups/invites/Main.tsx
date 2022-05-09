import { Box, Container, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../../database/interfaces";
import { searchForTravelGroupInvitesWithSender } from "../../../utils/search";
import { PrimarySearchBar } from "../../misc/searchBars";
import InviteCard from "./InviteCard";
import NoInvites from "./NoInvites";
import Snackbar from '../../misc/snackbars'

interface Props {
    user: ClientUser;
    invites: ClientTravelGroupInvitationWithSenderInfo[];
}

export default function Main({user, invites:dbInvites}:Props) {

    if (dbInvites.length === 0) {
        return <NoInvites />
    }

    const [invites, setInvites] = useState(dbInvites)
    const [search, setSearch] = useState('')
    const [searchedInvites, setSearchedInvites] = useState(invites)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    useMemo(() => {

        if (!search) {
            return setSearchedInvites(invites)
        }

        setSearchedInvites(searchForTravelGroupInvitesWithSender(search, invites))
    }, [search, invites])

    const removeInvite = (id:string) => {
        const copy = [...invites]
        let index = 0
        for (let i = 0; i < invites.length; i++) {
            if (invites[i].ref['@ref'].id === id) {
                index = i
                break
            }
        }
        copy.splice(index, 1)
        setInvites(copy)
    }

    const acceptInvite = (id:string) => {
        removeInvite(id)
        setSnackbarMsg({type: 'success', content: 'Accepted Invitation'})
    }

    const rejectInvite = (id:string) => {
        removeInvite(id)
        setSnackbarMsg({type: 'success', content: 'Rejected Invitation'})
    }

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Container maxWidth="sm">
                        <PrimarySearchBar search={search} setSearch={setSearch} /> 
                    </Container>
                </Box>
                <Box>
                    <Grid container alignItems="stretch" justifyContent="space-around">
                        {searchedInvites.map((inv, i) => (
                            <Grid item key={i} flexBasis={400} sx={{mb: 3, mx: 1}}>
                                <InviteCard invite={inv} user={user}
                                accept={() => acceptInvite(inv.ref['@ref'].id)}
                                reject={() => rejectInvite(inv.ref['@ref'].id)} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}