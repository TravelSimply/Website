import { Box, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientTravelGroupWithPopulatedTravellersAndContactInfo, ClientUser } from "../../../../database/interfaces";
import TravellerCard from "./TravellerCard";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroupWithPopulatedTravellersAndContactInfo;
}

export default function Main({user, travelGroup}:Props) {

    console.log(travelGroup)

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" textAlign="center" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Container maxWidth="xl">
                    <Typography color="primary.main" variant="h4">
                        {travelGroup.data.name}
                    </Typography>
                </Container>
            </Box>
            <Box>
                <Container maxWidth="xl">
                    <Grid container wrap="nowrap">
                        <Grid item flex={1}>
                            <Container maxWidth="md">
                                <Box mb={3}>
                                    <Box>
                                        <Box textAlign="center" color="text.secondary">
                                            <Typography variant="h3">
                                                Owner
                                            </Typography>
                                        </Box>
                                        <Box mx="auto" maxWidth={300}>
                                            <Divider />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                                         traveller={travelGroup.data.members.find(m => m.ref['@ref'].id === travelGroup.data.owner)}/>
                                    </Box>
                                </Box>
                                <Box mb={3}>
                                    <Box>
                                        <Box textAlign="center" color="text.secondary">
                                            <Typography variant="h3">
                                                Travelers
                                            </Typography>
                                        </Box>
                                        <Box mx="auto" maxWidth={300}>
                                            <Divider />
                                        </Box>
                                    </Box>
                                </Box>
                            </Container>
                        </Grid>
                        <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "max(300px, 25%)"}}>
                            <Box>
                                sidebar
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}