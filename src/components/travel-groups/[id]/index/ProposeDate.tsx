import { Backdrop, Box, Grid, RadioGroup, TextField, Typography, CircularProgress } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState, ChangeEvent, useCallback } from "react";
import useSWR from "swr";
import { ClientTravelGroup, ClientAvailability } from "../../../../database/interfaces";
import Calendar from "../../../calendar/Calendar";
import { RadioWithDesc } from "../../../forms/FormikFields";
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";

interface Props {
    travelGroup: ClientTravelGroup;
}

export default function ProposeDate({travelGroup}:Props) {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([null, null])
    const [availabilityDisplaying, setAvailabilityDisplaying] = useState('')

    const [availability, setAvailability] = useState({
        ref: {'@ref': {id: 'dummyId', ref: null}},
        data: {
            dates: {},
            userId: 'dummyUserId'
        }
    })

    const {data:memberAvailabilities} = useSWR<ClientAvailability[]>(
        availabilityDisplaying ? `/api/travel-groups/${travelGroup.ref['@ref'].id}/availabilities` : null, 
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000})

    const changeAvailability = () => {
        if (availabilityDisplaying === 'available') {
            setAvailability({
                ref: {'@ref': {id: 'available', ref: null}},
                data: {
                    dates: getAllAvailable(),
                    userId: 'available'
                }
            })
        } else {
            setAvailability({
                ref: {'@ref': {id: 'not-unavailable', ref: null}},
                data: {
                    dates: getAllNotUnavailable(),
                    userId: 'not-unavailable'
                }
            })
        }
    }

    const getMaxYear = useCallback(() => {
        let maxYear = dayjs().get('year')
        for (const data of memberAvailabilities) {
            for (const key of Object.keys(data.data.dates)) {
                if (dayjs(key).get('year') > maxYear) {
                    maxYear = dayjs(key).get('year')
                }
            }
        }
        
        return maxYear
    }, [memberAvailabilities])

    const getAllNotUnavailable = useCallback(() => {
        if (!memberAvailabilities) {
            return availability
        }

        const dates = {}
        let year = dayjs().get('year')
        const maxYear = getMaxYear()

        while (year <= maxYear) {
            
            const data = []
            for(const availability of memberAvailabilities) {
                const y = availability.data.dates[year.toString()]
                if (y?.unavailable) {
                    data.push(...y.unavailable)
                }
                if (y?.travelling) {
                    data.push(...y?.travelling)
                }
            }

            const viewedDates = {}

            dates[year.toString()] = {
                available: [],
                travelling: [],
                unavailable: data.filter(d => viewedDates[d] ? false : (viewedDates[d] = true))
            }

            year++;
        }

        return dates
    }, [memberAvailabilities])

    const getAllAvailable = useCallback(() => {
        if (!memberAvailabilities) {
            return availability
        }

        const dates = {}
        let year = dayjs().get('year')
        const maxYear = getMaxYear()

        while (year <= maxYear) {
            
            const data = []
            for (const availability of memberAvailabilities) {
                if(availability.data.dates[year.toString()]) {
                    data.push(availability.data.dates[year.toString()].available)
                } else {
                    data.push([])
                }
            }
            dates[year.toString()] = {
                unavailable: [],
                available: data.reduce((a, b) => a.filter(date => b.includes(date)), data[0] || []),
                travelling: []
            }

            year++;
        }

        return dates
    }, [memberAvailabilities])

    useMemo(() => {
        if (!memberAvailabilities) {
            return
        }

        changeAvailability()

    }, [memberAvailabilities])

    const filterRangeInBounds = useCallback<(range:[Dayjs, Dayjs]) => [Dayjs, Dayjs]>((range:[Dayjs, Dayjs]) => {
        if (travelGroup.data.date.unknown) {
            return range
        }
        const lowerBound = dayjs(travelGroup.data.date.start)
        const upperBound = dayjs(travelGroup.data.date.end)

        while (range[0]?.isBefore(lowerBound)) {
            if (range[0].isAfter(range[1])) {
                return [null, null]
            }
            range[0] = range[0].add(1, 'day')
        }
        while (range[1]?.isAfter(upperBound)) {
            if (range[1].isBefore(range[0])) {
                return [null, null]
            }
            range[1] = range[1].subtract(1, 'day')
        }

        return range
    }, [travelGroup])

    const date = useMemo(() => {
        return {
            start: dateRange[0]?.format('YYYY-MM-DD') || '',
            end: dateRange[1]?.format('YYYY-MM-DD') || ''
        }
    }, [dateRange])

    useMemo(() => {

        if (!memberAvailabilities) {
            return
        }

        changeAvailability()

    }, [availabilityDisplaying])

    const onDateRangeChange = (range:[Dayjs, Dayjs]) => {
        const boundedRange = filterRangeInBounds(range)
        setDateRange(boundedRange)
    }

    const handleDateInputChange = (type:string, e:ChangeEvent<HTMLInputElement>) => {
        if (type === 'start') {
            setDateRange(filterRangeInBounds([dayjs(e.target.value), dateRange[1]]))
        } else {
            setDateRange(filterRangeInBounds([dateRange[0], dayjs(e.target.value)]))
        }
    }

    console.log(availability)

    return (
        <Box>
            <Box mb={3} position="relative">
                <Backdrop sx={{position: 'absolute', zIndex: 1, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 10}}
                open={Boolean(availabilityDisplaying) && availability.ref['@ref'].id === 'dummyId'}>
                    <CircularProgress size={100} />
                </Backdrop>
                <Calendar dateRange={dateRange} onDateRangeChange={onDateRangeChange}
                availability={availability} startDate={dayjs(travelGroup.data.date.start)} />
            </Box>
            <Box my={3}>
                <Box maxWidth={600} mx="auto">
                    <RadioGroup value={availabilityDisplaying} onChange={(e) => setAvailabilityDisplaying(e.target.value)}>
                        <Box my={1}>
                            <RadioWithDesc value="available" selectedValue={availabilityDisplaying}
                            primaryText="Show days marked by all as available" secondaryText="Displayed in blue"  />                        
                        </Box> 
                        <Box my={1}>
                            <RadioWithDesc value="not-unavailable" selectedValue={availabilityDisplaying}
                            primaryText="Show days when users are not marked as unavailable or are travelling" 
                            secondaryText="Displayed in white" />
                        </Box>
                    </RadioGroup>
                </Box>
            </Box>
            <Box>
                <Grid container spacing={3} alignItems="center" justifyContent="center" wrap="nowrap">
                    <Grid item>
                        <TextField type="date" InputLabelProps={{shrink: true}}
                         label="Start" value={date.start}
                         onChange={(e) => handleDateInputChange("start", e as ChangeEvent<HTMLInputElement>)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            to
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField type="date" InputLabelProps={{shrink: true}}
                         label="End" value={date.end}
                         onChange={(e) => handleDateInputChange("end", e as ChangeEvent<HTMLInputElement>)} />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={4}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item>
                        <OrangePrimaryButton sx={{minWidth: 200}}>
                            Propose
                        </OrangePrimaryButton>
                    </Grid>
                    <Grid item>
                        <OrangeSecondaryButton sx={{minWidth: 200}}>
                            Cancel
                        </OrangeSecondaryButton>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}