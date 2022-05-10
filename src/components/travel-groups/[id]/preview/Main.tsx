import { Box, Container, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import Calendar from "../../../calendar/Calendar";
import Overview from "../index/Overview";
import Action from './Action'

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
}

export default function Main({user, travelGroup, invites}:Props) {

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
                <Box mb={1}>
                    <Action user={user} travelGroup={travelGroup} invites={invites} />
                </Box>
                <Box mb={3}>
                    <Paper>
                        <Box p={3}>
                            <Overview travelGroup={travelGroup} />
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
                                <Box>
                                    {!travelGroup.data.date.unknown && <Calendar 
                                    dateRange={[dayjs(travelGroup.data.date.start), dayjs(travelGroup.data.date.end)]}
                                    onDateRangeChange={() => {}} availability={{ref: {'@ref': {id: '1', ref: null}}, data: {userId: '1', dates: {}}}}
                                    displayOnly startDate={dayjs(travelGroup.data.date.start)} />}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}