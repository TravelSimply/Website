import { Box, ButtonGroup, CircularProgress, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { ClientTravelGroup, ClientTravelGroupInvitationWithToPopulated, ClientTravelGroupJoinRequestWithFromPopulated, ClientTravelGroupWithPopulatedTravellersAndContactInfo, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForUsers } from "../../../../utils/search";
import { darkPrimaryOnHover } from "../../../misc/animations";
import { PrimaryLink } from "../../../misc/links";
import { PrimarySearchBar } from "../../../misc/searchBars";
import { OrangeButtonGroup } from "../../../mui-customizations/buttonGroup";
import Invites from "./Invites";
import JoinRequests from "./JoinRequests";
import SendInvite from "./SendInvite";
import TravellerCard from "./TravellerCard";
import Travellers from "./Travellers";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    const [mode, setMode] = useState('travellers')

    const {data:travellers, isValidating:isValidatingTravellers} = useSWR<ClientUserWithContactInfo[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/travellers`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000})

    const {data:invites} = useSWR<ClientTravelGroupInvitationWithToPopulated[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const {data: requests} = useSWR<ClientTravelGroupJoinRequestWithFromPopulated[]>(
        `/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    const [search, setSearch] = useState('')

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Grid container wrap="nowrap">
                    <Grid item flex={1}>
                        <Box textAlign="center">
                            <PrimaryLink href="/travel-groups/[id]" as={`/travel-groups/${travelGroup.ref['@ref'].id}`}
                             variant="h4">
                                {travelGroup.data.name}
                            </PrimaryLink>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "clamp(400px, 600px, 40%)"}} />
                </Grid>
            </Box>
            {(travellers && !isValidatingTravellers && invites && requests) ? <Box>
                <Grid container wrap="nowrap">
                    <Grid item flex={1} minWidth={{xs: 0, sm: 500}}>
                        <Box mb={4}>
                            <Box mb={1}>
                                <Box textAlign="center" color="text.secondary">
                                    <Typography variant="h4">
                                        Owner
                                    </Typography>
                                </Box>
                                <Box mx="auto" maxWidth={300}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Box>
                                <Grid container justifyContent="center">
                                    <Grid item flexBasis={600}>
                                        <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                                        traveller={travellers.find(m => m.ref['@ref'].id === travelGroup.data.owner)}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Box mb={3}>
                            <Box mb={1}>
                                <Box textAlign="center" color="text.secondary">
                                    <Typography variant="h4">
                                        Travelers
                                    </Typography>
                                </Box>
                                <Box mx="auto" maxWidth={300}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Box textAlign="center" my={2}>
                                <OrangeButtonGroup selected={mode} setSelected={setMode} 
                                options={[
                                    {value: 'travellers', text: `${travellers.length} Travellers`},
                                    {value: 'invites', text: `${invites.length} Invites`},
                                    {value: 'requests', text: `${requests.length} Join Requests`}
                                ]} />
                            </Box>
                            <Box mb={2}>
                                <Box mx="auto" maxWidth="sm">
                                    <PrimarySearchBar search={search} setSearch={setSearch} />
                                </Box>
                            </Box>
                            <Box>
                                {mode === 'travellers' ? 
                                <Travellers user={user} travelGroup={travelGroup}
                                travellers={travellers} search={search} /> :
                                mode === 'invites' ?
                                <Invites travelGroup={travelGroup} users={travellers} search={search} invites={invites}
                                isAdmin={user.ref['@ref'].id === travelGroup.data.owner} /> :
                                <JoinRequests search={search} joinRequests={requests}
                                isAdmin={travelGroup.data.settings.joinRequestPriveleges === 'anyMember' ||
                                    user.ref['@ref'].id === travelGroup.data.owner} />
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "clamp(400px, 600px, 40%)"}}>
                        <Box>
                            <SendInvite invites={invites} user={user} travelGroup={travelGroup} />
                        </Box>
                    </Grid>
                </Grid>
            </Box> :
            <Box textAlign="center">
                <CircularProgress />
            </Box>}
        </Box>
    )
}