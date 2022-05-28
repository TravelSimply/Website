import { Box, Container, Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { ClientPopulatedAvailability, ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";
import Calendar from "../../../../../calendar/Calendar";
import { OrangePrimaryButton } from "../../../../../mui-customizations/buttons";
import JoinBar from "./JoinBar";
import Overview from "./Overview";

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function Main({user, trip}:Props) {

    const dateRange:[Dayjs, Dayjs] = useMemo(() => {
        return trip.data.date.unknown ? [null, null] : [
            dayjs(trip.data.date.start['@date']),
            dayjs(trip.data.date.end['@date'])
        ]
    }, [])

    const dummyAvailability:ClientPopulatedAvailability = useMemo(() => {
        return {
            ref: {'@ref': {id: '', ref: null}},
            data: {
                userId: '',
                dates: {}
            }
        }
    }, [])

    const onDateRangeChange = () => {}

    return (
        <Box my={3}>
            <Container maxWidth="md">
                <JoinBar user={user} trip={trip} />
                <Box mb={3}>
                    <Paper>
                        <Box p={3}>
                            <Overview trip={trip} /> 
                        </Box>
                    </Paper>
                </Box>
                <Box>
                    <Paper>
                        <Box p={3}>
                            {trip.data.date.unknown ? <Box>
                                <Box textAlign="center" mb={2}>
                                    <Typography variant="h6">
                                        No set date for travel yet
                                    </Typography>
                                </Box> 
                                <Box position="relative">
                                    <Box sx={{opacity: 0.3}}>
                                        <Calendar dateRange={dateRange} onDateRangeChange={onDateRangeChange}
                                        availability={dummyAvailability} displayOnly />
                                    </Box>
                                    <OrangePrimaryButton sx={{minWidth: 200, position: 'absolute', top: '50%',
                                    left: '50%', transform: 'translate(-50%, -50%)'}}>
                                        Propose a Date
                                    </OrangePrimaryButton>
                                </Box>
                            </Box> : <Box>
                                <Box textAlign="center" mb={2}>
                                    <Typography variant="h6">
                                        Traveling from {dateRange[0].format('MMMM D')} to {dateRange[1].format('MMMM D')}
                                    </Typography>
                                    <Box>
                                        <Calendar dateRange={dateRange} onDateRangeChange={onDateRangeChange}
                                        availability={dummyAvailability} displayOnly />
                                    </Box>
                                </Box>
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}