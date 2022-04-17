import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getDestination as getGeneralDestination } from "../../index/TravelGroupCard";
import dayjs from "dayjs";
import Calendar from "../../../calendar/Calendar";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Paper>
                        <Box p={3}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                                        borderRadius: 2}}
                                        src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                                        variant="square" />
                                    </Grid>
                                    <Grid item>
                                        <Box>
                                            <Box mb={2}>
                                                <Typography variant="h4">
                                                    {travelGroup.data.name}     
                                                </Typography>     
                                            </Box>
                                            <Box ml={2} mb={2}>
                                                <Grid container wrap="nowrap" alignItems="start">
                                                    <Grid item>
                                                        <LocationOnIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Box ml={1}>
                                                            {travelGroup.data.destination.address && <Typography variant="h6">
                                                                {travelGroup.data.destination.address},
                                                            </Typography>}
                                                            <Typography variant="h6">
                                                                {getGeneralDestination(travelGroup.data.destination)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Box ml={2}>
                                                <Typography variant="body1">
                                                    {travelGroup.data.desc}
                                                </Typography>
                                            </Box>
                                        </Box> 
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box>
                    <Paper>
                        <Box p={3}>
                            <Box textAlign="center" mb={2}>
                                <Typography variant="h6">
                                    {travelGroup.data.date.unknown ? 
                                    `${travelGroup.data.date.estLength[0]} 
                                    ${travelGroup.data.date.estLength[1].substring(0, travelGroup.data.date.estLength[1].length - 1)}
                                    trip.` : travelGroup.data.date.roughly ?
                                    `${travelGroup.data.date.estLength[0]} 
                                    ${travelGroup.data.date.estLength[1].substring(0, travelGroup.data.date.estLength[1].length - 1)}
                                    trip sometime between ${dayjs(travelGroup.data.date.start).format('MMMM D')} and 
                                    ${dayjs(travelGroup.data.date.end).format('MMMM D')}.` :
                                    `Traveling from ${dayjs(travelGroup.data.date.start).format('MMMM D')} to 
                                    ${dayjs(travelGroup.data.date.end).format('MMMM D')}.`
                                    }
                                </Typography>
                            </Box>
                            {!travelGroup.data.date.unknown && <Box>
                                <Calendar dateRange={[dayjs(travelGroup.data.date.start), dayjs(travelGroup.data.date.end)]}
                                onDateRangeChange={(a) => {}} availability={{ref: {'@ref': {id: '1', ref: null}}, data: {userId: '1', dates: {}}}}
                                displayOnly startDate={dayjs(travelGroup.data.date.start)} />
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}