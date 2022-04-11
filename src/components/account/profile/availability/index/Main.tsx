import { Box, Container, Grid, Paper, Typography, ButtonGroup } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { ClientPopulatedAvailability } from "../../../../../database/interfaces";
import Calendar from "../../../../calendar/Calendar";
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../../../mui-customizations/buttons";

interface Props {
    availability: ClientPopulatedAvailability;
}

export default function Main({availability:dbAvailability}:Props) {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([null, null])
    const [updating, setUpdating] = useState('unknown')
    const [changesMade, setChangesMade] = useState(false)

    const [availability, setAvailability] = useState(dbAvailability)

    const updateDayStatus = useCallback((year:string, format:string, availabilityCopy:ClientPopulatedAvailability) => {
        for (const day of availabilityCopy.data.dates[year]?.travelling || []) {
            if (day === format) {
                return false
            }
        }
        let removedVal = false
        for (let i = 0; i < availabilityCopy.data.dates[year]?.available.length || 0; i++) {
            const day = availabilityCopy.data.dates[year].available[i]
            if (day !== format) {
                continue
            }
            if (updating === 'available') {
                return false
            }
            removedVal = true
            availabilityCopy.data.dates[year].available.splice(i, 1)
            break
        }
        for (let i = 0; i < availabilityCopy.data.dates[year]?.unavailable.length || 0; i++) {
            const day = availabilityCopy.data.dates[year].unavailable[i]
            if (day !== format) {
                continue
            }
            if (updating === 'unavailable') {
                return false
            }
            removedVal = true
            availabilityCopy.data.dates[year].unavailable.splice(i, 1)
            break
        }
        if (!availabilityCopy.data.dates[year]) {
            availabilityCopy.data.dates[year] = {
                available: [],
                unavailable: [],
                travelling: []
            }
        }
        if (updating !== 'unknown') {
            availabilityCopy.data.dates[year][updating].push(format)
        } else if (!removedVal) {
            return false 
        }
        return true 
    }, [dbAvailability, updating])

    const onDateRangeChange = (dateRange:[Dayjs, Dayjs]) => {
        let change = false
        const availabilityCopy = {...availability}
        for (let day = dateRange[0]; day.isBefore(dateRange[1]) || day.isSame(dateRange[1], 'day'); day = day.add(1, 'day')) {
            const year = day.format('YYYY')
            const format = day.format('MMDD')
            if (updateDayStatus(year, format, availabilityCopy)) {
                change = true
            }
        }
        if (change) {
            setAvailability(availabilityCopy)
            setChangesMade(true)
        }
    }

    const legend = useMemo(() => {
        return [{color: '#fff', value: 'Unknown'}, {color: 'rgba(0,0,0,0.3)', value: 'Unavailable'},
        {color: 'hsl(209, 93%, 92%)', value: 'Available'}, {color: 'hsl(30, 96%, 62.4%)', value: 'Traveling'}]
    }, [])

    return (
        <Box m={3}>
            <Container maxWidth="lg">
                <Paper>
                    <Box p={1}>
                        <Box my={1}>
                            <Grid container spacing={3} >
                                <Grid item>
                                    <Box mt={1.75}>
                                        <Typography variant="h6">
                                            Updating days I'm
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box mb={3}>
                                        <ButtonGroup>
                                            {updating === 'unknown' ? <OrangePrimaryButton>
                                                Unknown
                                            </OrangePrimaryButton> : <OrangeSecondaryButton 
                                            onClick={() => setUpdating('unknown')}>
                                                Unknown     
                                            </OrangeSecondaryButton>}
                                            {updating === 'available' ? <OrangePrimaryButton>
                                                Available 
                                            </OrangePrimaryButton> : <OrangeSecondaryButton
                                            onClick={() => setUpdating('available')}>
                                                Available 
                                            </OrangeSecondaryButton>}
                                            {updating === 'unavailable' ? <OrangePrimaryButton>
                                                Unavailable 
                                            </OrangePrimaryButton> : <OrangeSecondaryButton
                                            onClick={() => setUpdating('unavailable')}>
                                                Unavailable 
                                            </OrangeSecondaryButton>}
                                        </ButtonGroup>
                                    </Box>
                                    <Box>
                                        {changesMade ? <OrangePrimaryButton>
                                            Save Changes
                                        </OrangePrimaryButton> :
                                        <OrangeSecondaryButton disabled>
                                            Save Changes
                                        </OrangeSecondaryButton>}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mb={3}>
                            <Grid container spacing={3}>
                                <Grid item width={{md: 'auto', xs: '100%'}}>
                                    <Box minWidth={{md: 850, xs: '100%'}}>
                                        <Calendar availability={availability}
                                         dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
                                    </Box>
                                </Grid>
                                <Grid item flex={1}>
                                    <Grid container maxWidth="md" height="100%" alignItems="center" justifyContent="center">
                                        <Grid item >
                                            {legend.map(item => (
                                                <Box display="inline-block" key={item.color} mx={3} my={2}>
                                                    <Grid container spacing={1} wrap="nowrap" alignItems="center">
                                                        <Grid item>
                                                            <Box width={20} height={20} bgcolor={item.color}
                                                            border="1px solid rgba(0,0,0,0.5)" />
                                                        </Grid> 
                                                        <Grid item>
                                                            <Typography variant="body1">
                                                                {item.value}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mt={6}>
                            <Box mb={2}>
                                <Typography variant="h6">
                                    For month displayed, set 
                                </Typography>
                            </Box>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <OrangePrimaryButton>
                                            All Weekends to Available
                                        </OrangePrimaryButton>
                                    </Grid>
                                    <Grid item>
                                        <OrangePrimaryButton>
                                            All Weekdays to Unavailable
                                        </OrangePrimaryButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}