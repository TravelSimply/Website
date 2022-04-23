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
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Grid container wrap="nowrap">
                    <Grid item flex={1}>
                        <Box textAlign="center">
                            <Typography color="primary.main" variant="h4">
                                {travelGroup.data.name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "max(300px, 25%)"}} />
                </Grid>
            </Box>
            <Box>
                <Grid container wrap="nowrap">
                    <Grid item flex={1}>
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
                                        traveller={travelGroup.data.members.find(m => m.ref['@ref'].id === travelGroup.data.owner)}/>
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
                            <Box>
                                <Box>
                                    <Grid container alignItems="stretch" justifyContent="space-around" spacing={3}>
                                        {travelGroup.data.members.map((member, i) => (
                                            <Grid item key={i} flexBasis={600}>
                                                <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                                                traveller={member} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "max(300px, 25%)"}}>
                        <Box>
                            sidebar
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}