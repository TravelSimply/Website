import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { ClientTravelGroup, ClientUser } from "../../../database/interfaces";
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link'
import { enlargeOnHover } from "../../misc/animations";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export const getDestination = (dest:ClientTravelGroup['data']['destination']) => {
    if (dest.city) {
        return `${dest.city}, ${dest.country}`
    }
    if (dest.state) {
        return `${dest.state}, ${dest.country}`
    }
    if (dest.country) {
        return `${dest.country}`
    }
    return dest.region
}

export default function TravelGroupCard({user, travelGroup}:Props) {

    const formatDate = (day:Dayjs) => {
        return day.format('MMMM D')
    }


    return (
        <Box py={3}>
            <Link href="/travel-groups/[id]" as={`/travel-groups/${travelGroup.ref['@ref'].id}`}>
                <a>
                    <Paper sx={{...enlargeOnHover}}>
                        <Box>
                            <Grid container>
                                <Grid item>
                                    <Box>
                                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}, 
                                        }}
                                        src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                                        variant="square" />
                                    </Box>
                                </Grid>
                                <Grid item flex={1}>
                                    <Box ml={2} mr={1}>
                                        <Box my={1}>
                                            <Grid container spacing={3} justifyContent="space-between" alignItems="center"
                                            wrap="nowrap">
                                                <Grid item>
                                                    <Typography variant="h4" color="primary.main">
                                                        {travelGroup.data.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" color="primary.dark">
                                                        {travelGroup.data.owner === user.ref['@ref'].id ? 'owner' : 'traveler'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box ml={2} my={2}>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <DateRangeIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                </Grid>
                                                <Grid item>
                                                    <Box ml={1}>
                                                        <Typography variant="h6">
                                                            {travelGroup.data.date.unknown ? 'Undecided days of travel.' : 
                                                            travelGroup.data.date.roughly ? 
                                                            `Traveling sometime between ${formatDate(dayjs(travelGroup.data.date.start))}
                                                            and ${formatDate(dayjs(travelGroup.data.date.end))}.` : 
                                                            `Traveling from ${formatDate(dayjs(travelGroup.data.date.start))} to 
                                                            ${formatDate(dayjs(travelGroup.data.date.end))}.`}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box ml={2}>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <LocationOnIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                </Grid>
                                                <Grid item>
                                                    <Box ml={1}>
                                                        <Typography variant="h6">
                                                            {getDestination(travelGroup.data.destination)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </a>
            </Link>
        </Box>
    )
}