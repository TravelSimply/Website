import { Box, Container, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../../database/interfaces";
import { searchForTravelGroupInvitesWithSender } from "../../../utils/search";
import { PrimarySearchBar } from "../../misc/searchBars";
import InviteCard from "./InviteCard";
import NoInvites from "./NoInvites";

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

    useMemo(() => {

        if (!search) {
            return setSearchedInvites(invites)
        }

        setSearchedInvites(searchForTravelGroupInvitesWithSender(search, invites))
    }, [search])

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
                                <InviteCard invite={inv} remove={() => {}} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}