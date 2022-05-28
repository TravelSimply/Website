import { Box, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";
import { PrimaryLink } from "../../../../../misc/links";
import {TripTravellerCard} from "../../../cards/TravellerCard";
import Contact from "../../../travellers/Contact";

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function Main({user, trip}:Props) {

    const {data:travellers} = useSWR(
        `/api/travel-groups/${trip.data.travelGroup.id}/trips/${trip.ref['@ref'].id}/travellers`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    console.log(travellers)

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)" overflow="hidden">
                <Box textAlign="center" sx={{whiteSpace: 'nowrap'}}>
                    <PrimaryLink href="/travel-groups/[id]" as={`/travel-groups/${trip.data.travelGroup.id}`} variant="h4">
                        {trip.data.travelGroup.name}
                    </PrimaryLink>
                    <Typography display="inline" variant="h4" color="primary">
                        {' - '}
                    </Typography>
                    <PrimaryLink href="/travel-groups/[id]/trips/[tripId]" 
                    as={`/travel-groups/${trip.data.travelGroup.id}/trips/${trip.ref['@ref'].id}`}
                        variant="h4">
                        {trip.data.name}
                    </PrimaryLink>
                </Box>
            </Box>
            {travellers ? <Box>
                <Grid container wrap="nowrap">
                    <Grid item flex={1} minWidth={{xs: 0, sm: 500}}>
                        <Box mb={4}>
                            <Box mb={1}>
                                <Box textAlign="center" color="text.secondary">
                                    <Typography variant="h4">
                                        Trip Leader
                                    </Typography>
                                </Box>
                                <Box mx="auto" maxWidth={300}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Box>
                                <Grid container justifyContent="center">
                                    <Grid item flexBasis={600}>
                                        <TripTravellerCard user={user} isAdmin={trip.data.leader === user.ref['@ref'].id}
                                        traveller={travellers.find(m => m.ref['@ref'].id === trip.data.leader)}
                                        travellers={travellers} trip={trip} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "clamp(400px, 600px, 40%)"}}>
                        <Box>
                            <Contact travellers={travellers} />
                        </Box>
                    </Grid>
                </Grid>
            </Box> : <Box textAlign="center">
                <CircularProgress /> 
            </Box>}
        </Box>
    )
}