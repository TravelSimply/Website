import { Box, Grid } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { mutate } from "swr";
import { ClientTravelGroup, ClientTravelGroupInvitationUsersPopulated, ClientTravelGroupInvitationWithToPopulated, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForTravelGroupInvites } from "../../../../utils/search";
import { handleRemoveInvite } from "../utils/invites";
import InviteCard from './InviteCard'

interface Props {
    users: ClientUserWithContactInfo[];
    invites: ClientTravelGroupInvitationWithToPopulated[];
    search: string;
    travelGroup: ClientTravelGroup;
    isAdmin: boolean;
}

export default function Invites({users, invites, search, travelGroup, isAdmin}:Props) {

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

    const removeInvite = useCallback((inv:ClientTravelGroupInvitationUsersPopulated) => {
        handleRemoveInvite(inv, invites, travelGroup)
    }, [invites])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedInvites.map((inv, i) => (
                    <Grid item key={inv.ref['@ref'].id} flexBasis={400} sx={{mb: 3, mx: 1}}>
                        <InviteCard invite={inv} isAdmin={isAdmin} travelGroup={travelGroup}
                        remove={() => removeInvite(inv)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}