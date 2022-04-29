import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getDestination as getGeneralDestination } from "../../index/TravelGroupCard";
import dayjs from "dayjs";
import Calendar from "../../../calendar/Calendar";
import { useMemo, useState } from "react";
import { OrangePrimaryButton, OrangePrimaryIconButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EditOverview from './EditOverview'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    const [editing, setEditing] = useState(false)

    const [start, end] = useMemo(() => {
        return [
            dayjs(travelGroup.data.date.start).format('MMMM D'),
            dayjs(travelGroup.data.date.end).format('MMMM D')
        ]
    }, [])

    const estLength = useMemo(() => {
        return `${travelGroup.data.date.estLength[0]} 
        ${travelGroup.data.date.estLength[1].substring(0, travelGroup.data.date.estLength[1].length - 1)}`
    }, [])

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Paper>
                        <Box position="relative" p={3}>
                            {editing ? <EditOverview travelGroup={travelGroup}
                            isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                            junkIds={user.data.junkImagePublicIds} /> 
                            : <Box>
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
                            </Box>}
                            <Box position="absolute" top="0px" right="0px">
                                <OrangePrimaryIconButton onClick={() => setEditing(!editing)}>
                                    {editing ? <CancelIcon sx={{fontSize: 30}} /> :
                                    <EditIcon sx={{fontSize: 30}} /> }
                                </OrangePrimaryIconButton>
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
                                    `${estLength} trip.` : 
                                    travelGroup.data.date.roughly ?
                                    `${estLength} trip sometime between ${start} and ${end}.` :
                                    `Traveling from ${start} to ${end}.`
                                    }
                                </Typography>
                            </Box>
                            {!travelGroup.data.date.unknown && <Box mb={2}>
                                <Calendar dateRange={[dayjs(travelGroup.data.date.start), dayjs(travelGroup.data.date.end)]}
                                onDateRangeChange={(a) => {}} availability={{ref: {'@ref': {id: '1', ref: null}}, data: {userId: '1', dates: {}}}}
                                displayOnly startDate={dayjs(travelGroup.data.date.start)} />
                            </Box>}
                            <Box mb={2}>
                                <Grid container spacing={3} justifyContent="center">
                                    <Grid item>
                                        {(travelGroup.data.date.unknown || travelGroup.data.date.roughly) && <OrangePrimaryButton>
                                            Propose a Travel Date     
                                        </OrangePrimaryButton>}
                                    </Grid>
                                    <Grid item>
                                        {travelGroup.data.owner === user.ref['@ref'].id && <OrangeSecondaryButton>
                                            Modify Travel Date Settings     
                                        </OrangeSecondaryButton>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}