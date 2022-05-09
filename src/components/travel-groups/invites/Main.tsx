import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";
import { ClientTravelGroupInvitationWithSenderInfo, ClientUser } from "../../../database/interfaces";
import { PrimarySearchBar } from "../../misc/searchBars";
import InviteCard from "./InviteCard";
import NoInvites from "./NoInvites";

interface Props {
    user: ClientUser;
    invites: ClientTravelGroupInvitationWithSenderInfo[];
}

export default function Main({user, invites}:Props) {

    if (invites.length === 0) {
        return <NoInvites />
    }

    const [search, setSearch] = useState('')
    const [searchedInvites, setSearchedInvites] = useState(invites)

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