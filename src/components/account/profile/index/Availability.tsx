import { Box, Divider, Grid, Paper, Typography } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { ClientPopulatedAvailability } from "../../../../database/interfaces"
import Link from 'next/link'
import { OrangePrimaryButton } from "../../../mui-customizations/buttons"
import SmallCalendar from "../../../calendar/SmallCalendar"

interface Props {
    availability: ClientPopulatedAvailability;
}

export default function Availability({availability}:Props) {

    const availabilityMessage = useMemo(() => {
        if (!availability) {
            return 'Your availability for the next week is unknown.'
        }

        const counts = {
            unknown: 0,
            unavailable: 0,
            available: 0,
            travelling: 0
        }

        let day = dayjs().startOf('week')
        let weekText = 'this'
        if (dayjs().day() > 4) {
            day = dayjs().add(6, 'days').startOf('week')
            weekText = 'next'
        }

        const year = day.format('YYYY')
        for (let i = 0; i < 7; i++) {
            const format = day.format('MMDD')
            if (availability.data.dates[year]?.travelling?.includes(format)) {
                counts.travelling++
                continue
            }
            if (availability.data.dates[year]?.available.includes(format)) {
                counts.available++
                continue
            }
            if (availability.data.dates[year]?.unavailable.includes(format)) {
                counts.unavailable++
            }
            day = day.add(1, 'days')
        }

        if (counts.travelling > 0) {
            return `You are traveling ${counts.travelling} days ${weekText} week.`
        }
        if (counts.available > 0) {
            return `You are available to travel ${counts.available} days ${weekText} week.`
        }
        if (counts.unavailable > 3) {
            return `You are unavailable to travel most of ${weekText} week.`
        }
        return `Your availability for ${weekText} week is mostly unknown.`

    }, [availability])

    return (
        <Paper>
            <Box p={2}>
                <Grid container spacing={3} alignItems="stretch" justifyContent="space-between">
                    <Grid item flexGrow={1}>
                        <Grid container direction="column" justifyContent="space-between" sx={{height: "100%"}}>
                            <Box>
                                <Box textAlign="center" mb={3}>
                                    <Typography gutterBottom variant="h4">
                                        Availablility
                                    </Typography>
                                    <Box maxWidth={200} mx="auto">
                                        <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                    </Box>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="h6">
                                        {availabilityMessage}
                                    </Typography> 
                                </Box>
                            </Box>
                            <Box mt={3} textAlign="center">
                                <Link href="/profile/availability">
                                    <a>
                                        <OrangePrimaryButton>
                                            Update Availability
                                        </OrangePrimaryButton>
                                    </a>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Box width={400}>
                            <SmallCalendar availability={availability} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}