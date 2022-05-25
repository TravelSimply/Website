import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { ClientTrip, ClientUser } from "../../../../../database/interfaces";
import Link from 'next/link'
import { enlargeOnHover } from "../../../../misc/animations";
import DateRangeIcon from '@mui/icons-material/DateRange'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'

interface Props {
    trip: ClientTrip;
    user: ClientUser;
}

export const getDestination = (dest:ClientTrip['data']['destination']) => {
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

export default function TripCard({user, trip}:Props) {

    const formatDate = (day:Dayjs) => {
        return day.format('MMMM D')
    }

    const isTraveller = useMemo(() => trip.data.members.includes(user.ref['@ref'].id), [trip])

    return (
        <Box py={3}>
            <Link href={`/travel-groups/[id]/trips/[tripId]`}
            as={`/travel-groups/${trip.data.travelGroup}/trips/${trip.ref['@ref'].id}`}>
                <a>
                    <Paper sx={{...enlargeOnHover}}>
                        <Box>
                            <Grid container>
                                <Grid item>
                                    <Box>
                                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}, 
                                        }} imgProps={{loading: 'lazy'}}
                                        src={trip.data.image?.src || '/default_trip.png'}
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
                                                        {trip.data.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" color="primary.dark">
                                                        {trip.data.leader === user.ref['@ref'].id ? 'leader' : 
                                                        isTraveller ? 'traveler' : ''}
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
                                                            {trip.data.date.unknown ? 'Undecided days of travel.' : 
                                                            `Traveling from ${formatDate(dayjs(trip.data.date.start['@date']))} to 
                                                            ${formatDate(dayjs(trip.data.date.end['@date']))}.`}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box ml={2} mb={2}>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <LocationOnIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                </Grid>
                                                <Grid item>
                                                    <Box ml={1}>
                                                        <Typography variant="h6">
                                                            {getDestination(trip.data.destination)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box ml={2}>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <GroupIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                </Grid>
                                                <Grid item>
                                                    <Box ml={1}>
                                                        <Typography variant="h6">
                                                            {trip.data.members.length} travelers
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