import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { ClientTravelGroup, ClientUser } from "../../../database/interfaces";
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import Link from 'next/link'
import { enlargeOnHover } from "../../misc/animations";
import { useMemo } from "react";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export default function TravelGroupCard({user, travelGroup}:Props) {

    const isTraveller = useMemo(() => travelGroup.data.members.includes(user.ref['@ref'].id), [travelGroup])

    return (
        <Box py={3}>
            <Link href={`/travel-groups/[id]${isTraveller ? '' : '/preview'}`}
            as={`/travel-groups/${travelGroup.ref['@ref'].id}${isTraveller ? '' : '/preview'}`}>
                <a>
                    <Paper sx={{...enlargeOnHover}}>
                        <Box>
                            <Grid container>
                                <Grid item>
                                    <Box>
                                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}, 
                                        }} imgProps={{loading: 'lazy'}}
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
                                                        {travelGroup.data.owner === user.ref['@ref'].id ? 'owner' : 
                                                        isTraveller ? 'traveler' : ''}
                                                    </Typography>
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
                                                            {travelGroup.data.members.length} travelers
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