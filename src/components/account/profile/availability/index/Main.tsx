import { Box, Container, Grid, Paper, Typography, ButtonGroup } from "@mui/material";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { ClientPopulatedAvailability } from "../../../../../database/interfaces";
import Calendar from "../../../../calendar/Calendar";
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton, OrangePrimaryButton, OrangeSecondaryButton } from "../../../../mui-customizations/buttons";
import Snackbar from '../../../../misc/snackbars'

interface Props {
    availability: ClientPopulatedAvailability;
}

export default function Main({availability:dbAvailability}:Props) {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([null, null])
    const [updating, setUpdating] = useState('unknown')
    const [changesMade, setChangesMade] = useState(false)
    const [saving, setSaving] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [availability, setAvailability] = useState(dbAvailability)

    const updateDayStatus = useCallback((year:string, format:string, availabilityCopy:ClientPopulatedAvailability) => {
        // alas, an O(n^2) tragedy is created.
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
        return [{color: '#fff', value: 'Unknown'}, {color: 'rgba(0,0,0,0.4)', value: 'Unavailable'},
        {color: 'hsl(209, 93%, 92%)', value: 'Available'}, {color: 'hsl(30, 96%, 62.4%)', value: 'Traveling'}]
    }, [])

    const saveChanges = async () => {
        setSaving(true)

        try {

            const availabilityCopy:ClientPopulatedAvailability = JSON.parse(JSON.stringify(availability))

            for (const [key, value] of Object.entries(availabilityCopy.data.dates)) {
                if (value.travelling) {
                    delete value.travelling
                }
            }

            await axios({
                method: 'POST',
                url: '/api/users/profile/availability/update',
                data: {
                    id: availability.ref['@ref'].id,
                    dates: availabilityCopy.data.dates
                }
            })

            setSnackbarMsg({type: 'success', content: 'Availability Saved Successfully'})
            setChangesMade(false)
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Failed to Save Availability'})
        }

        setSaving(false)
    }

    return (
        <Box m={3}>
            <Container maxWidth="lg">
                <Paper>
                    <Box p={1}>
                        <Box my={1}>
                            <Grid container spacing={3} alignItems="center" >
                                <Grid item>
                                    <Box>
                                        <Typography variant="h6">
                                            Updating days I'm
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <ButtonGroup>
                                        {updating === 'unknown' ? <OrangeDensePrimaryButton>
                                            Unknown
                                        </OrangeDensePrimaryButton> : <OrangeDenseSecondaryButton
                                        onClick={() => setUpdating('unknown')}>
                                            Unknown     
                                        </OrangeDenseSecondaryButton>}
                                        {updating === 'available' ? <OrangeDensePrimaryButton>
                                            Available 
                                        </OrangeDensePrimaryButton> : <OrangeDenseSecondaryButton
                                        onClick={() => setUpdating('available')}>
                                            Available 
                                        </OrangeDenseSecondaryButton>}
                                        {updating === 'unavailable' ? <OrangeDensePrimaryButton>
                                            Unavailable 
                                        </OrangeDensePrimaryButton> : <OrangeDenseSecondaryButton
                                        onClick={() => setUpdating('unavailable')}>
                                            Unavailable 
                                        </OrangeDenseSecondaryButton>}
                                    </ButtonGroup>
                                </Grid>
                                <Grid item>
                                    {changesMade ? <OrangePrimaryButton disabled={saving}
                                    onClick={() => saveChanges()}>
                                        Save Changes
                                    </OrangePrimaryButton> :
                                    <OrangeSecondaryButton disabled>
                                        Save Changes
                                    </OrangeSecondaryButton>}
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mb={3}>
                            <Grid container spacing={3}>
                                <Grid item width={{md: 'auto', xs: '100%'}}>
                                    <Box minWidth={{md: 850, xs: '100%'}}>
                                        <Calendar availability={availability}
                                         dateRange={dateRange} onDateRangeChange={onDateRangeChange}
                                         hoverColor={legend.find(l => l.value.toLowerCase() === updating)?.color} />
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
                                                            <Box sx={{'&:hover': {cursor: item.value !== 'Traveling' ? 'Pointer' : 'auto'}}}
                                                            onClick={() => item.value !== 'Traveling' && setUpdating(item.value.toLowerCase())}>
                                                                <Typography variant="body1">
                                                                    {item.value}
                                                                </Typography>
                                                            </Box>
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
                                        <OrangeSecondaryButton>
                                            All Weekends to Available
                                        </OrangeSecondaryButton>
                                    </Grid>
                                    <Grid item>
                                        <OrangeSecondaryButton>
                                            All Weekdays to Unavailable
                                        </OrangeSecondaryButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}