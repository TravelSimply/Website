import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClientAvailability, ClientTravelGroup } from "../../database/interfaces";
import Calendar from "../calendar/Calendar";

interface Props {
    travelGroups: ClientTravelGroup[];
}

export default function TravelViewer({travelGroups}:Props) {

    const {startDate, availability} = useMemo(() => {
        const availability:ClientAvailability = {ref: {'@ref': {id: 'hello', ref: null}}, data: {userId: 'user', dates: {}}}

        let earliestDate = null
        for (const travelGroup of travelGroups) {
            if (travelGroup.data.date.unknown || travelGroup.data.date.roughly) continue
            const start = dayjs(travelGroup.data.date.start)
            const end = dayjs(travelGroup.data.date.end)
            if (!earliestDate || start.isBefore(earliestDate)) earliestDate = start
            let curr = start
            while (curr.isBefore(end) || curr.isSame(end, 'day')) {
                const year = curr.format('YYYY')
                if (!availability.data.dates[year]) {
                    availability.data.dates[year] = {
                        unavailable: [],
                        available: [],
                        travelling: []
                    }
                }
                if (!availability.data.dates[year].travelling.includes(curr.format('MMDD'))) {
                    availability.data.dates[year].travelling.push(curr.format('MMDD'))
                }
                curr = curr.add(1, 'day')
            }
        }

        return {startDate: earliestDate || dayjs(), availability}
    }, [travelGroups])

    return (
        <Box>
            {Object.keys(availability.data.dates).length === 0 && <Box my={1} textAlign="center"
            maxWidth={600} mx="auto">
                <Typography variant="h6">
                    Days you are traveling will be highlighted below when one of your Travel Groups has 
                    a traveling date set! 
                </Typography>
            </Box>}
            <Box>
                <Calendar availability={availability} startDate={startDate} displayOnly
                dateRange={[null, null]} onDateRangeChange={(a) => {}} />
            </Box>
        </Box>
    )
}