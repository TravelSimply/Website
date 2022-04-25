import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroupInvitationUsersPopulated, ClientTravelGroupInvitationWithToPopulated, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForTravelGroupInvites } from "../../../../utils/search";
import InviteCard from './InviteCard'

interface Props {
    user: ClientUser;
    users: ClientUserWithContactInfo[];
    invites: ClientTravelGroupInvitationWithToPopulated[];
    search: string;
    isAdmin: boolean;
}

export default function Invites({user, users, invites, search, isAdmin}:Props) {

    if (!invites || !users) {
        return null
    }

    const [searchedInvites, setSearchedInvites] = useState<ClientTravelGroupInvitationUsersPopulated[]>([])

    const popInvites = useMemo(() => {

        return invites.map(inv => {
            const u = users.find(u => u.ref['@ref'].id === inv.data.from)
            if (!u) {
                return null
            }
            return {
                ...inv,
                data: {
                    ...inv.data,
                    from: u
                }
            }
        }).filter(inv => inv)
    }, [invites])

    useMemo(() => {
        if (!popInvites) {
            return
        }
        setSearchedInvites(popInvites)
    }, [popInvites])

    useMemo(() => {
        if (!popInvites) {
            return
        }

        if (!search.trim()) {
            setSearchedInvites(popInvites)
        }

        setSearchedInvites(searchForTravelGroupInvites(search, popInvites))
    }, [search])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedInvites.map((inv, i) => (
                    <Grid item key={i} flexBasis={400} sx={{mb: 3, mx: 1}}>
                        <InviteCard invite={inv} isAdmin={isAdmin} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}