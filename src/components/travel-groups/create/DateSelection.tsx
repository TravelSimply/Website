import { Box, RadioGroup, Radio, FormControl, FormControlLabel, Container, Grid, FormLabel, Typography, Collapse, TextField, Select, MenuItem, SelectChangeEvent, Checkbox } from "@mui/material";
import Calendar from "../../calendar/Calendar";
import {ChangeEvent, useMemo, useState} from 'react'
import dayjs, { Dayjs } from "dayjs";
import { ClientPopulatedAvailability } from "../../../database/interfaces";

export interface Props {
    date: {
        unknown: boolean;
        roughly: boolean;
        start: string;
        end: string;
        estLength: [number, string];
    };
    setDate: (date:Props['date']) => void;
    availability: ClientPopulatedAvailability;
}

export default function DateSelection({date, setDate, availability:dbAvailability}:Props) {

    const [availability, setAvailability] = useState(dbAvailability)

    const handleCertaintyChange = (e:ChangeEvent<HTMLInputElement>) => {
        setDate({...date, unknown: e.target.value === 'unknown', roughly: e.target.value === 'roughly'})
    }

    const dateRange = useMemo<[Dayjs, Dayjs]>(() => {
        return [date.start ? dayjs(date.start) : null, date.end ? dayjs(date.end) : null]
    }, [date])

    const onDateRangeChange = ([start, end]:[Dayjs, Dayjs]) => {
        setDate({...date, start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD')})
    }

    const handleDateInputChange = (type:string, e:ChangeEvent<HTMLInputElement>) => {
        if (type === 'start') {
            setDate({...date, start: e.target.value})
        } else {
            setDate({...date, end: e.target.value})
        }
    }

    const estLengthMagnitudes = ["days", "weeks", "months"]

    const handleTripLenNumChange = (e:ChangeEvent<HTMLInputElement>) => {
        if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
            return
        } 
        setDate({...date, estLength: [parseInt(e.target.value), date.estLength[1]]})
    }

    const handleTripLenMagChange = (e:SelectChangeEvent) => {
        setDate({...date, estLength: [date.estLength[0], e.target.value]})
    }

    const toggleDisplayAvailability = () => {
        if (availability.ref['@ref'].id) {
            setAvailability({
                ref: {'@ref': {id: '', ref: null}},
                data: {
                    dates: {},
                    userId: availability.data.userId
                }
            })
        } else {
            setAvailability(dbAvailability)
        }
    }

    return (
        <Box>
            <Box>
                <Container maxWidth="sm">
                    <Box>
                        <FormControl>
                            <RadioGroup name="date-certainty" 
                            value={date.unknown ? 'unknown' : date.roughly ? 'roughly' : 'certain'}
                            onChange={(e) => handleCertaintyChange(e)} >
                                <Box mb={2}>
                                    <Grid container spacing={3} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Radio id="date-certainty-unknown" value="unknown" />
                                        </Grid>
                                        <Grid item>
                                            <label htmlFor="date-certainty-unknown">
                                                <Box>
                                                    <Typography variant="h6">
                                                        I don't know when we'll travel.
                                                    </Typography>
                                                </Box>
                                            </label>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={2}>
                                    <Grid container spacing={3} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Radio id="date-certainty-roughly" value="roughly" />
                                        </Grid>
                                        <Grid item>
                                            <label htmlFor="date-certainty-roughly">
                                                <Box>
                                                    <Typography variant="h6">
                                                        I know roughly when we'll travel.
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography color="rgba(0,0,0,0.7)" variant="subtitle1">
                                                        e.g. Sometime in Summer 2024
                                                    </Typography>
                                                </Box>
                                            </label>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box>
                                    <Grid container spacing={3} wrap="nowrap" alignItems="center">
                                        <Grid item>
                                            <Radio id="date-certainty-certain" value="certain" />
                                        </Grid>
                                        <Grid item>
                                            <label htmlFor="date-certainty-certain">
                                                <Box>
                                                    <Typography variant="h6">
                                                        I know when we'll travel.
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" color="rgba(0,0,0,0.7)">
                                                        e.g. March 20 to March 25
                                                    </Typography>
                                                </Box>
                                            </label>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Container>
            </Box>
            <Collapse in={date.unknown || date.roughly}>
                <Container maxWidth="sm">
                    <Box mt={8}>
                        <Box mb={2}>
                            <Typography variant="h6">
                                Estimated trip length
                            </Typography>
                        </Box>
                        <Box>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    About
                                </Grid>
                                <Grid item>
                                    <Box width={90}>
                                        <TextField type="number" value={date.estLength[0]}
                                        onChange={(e) => handleTripLenNumChange(e as ChangeEvent<HTMLInputElement>)} />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Select value={date.estLength[1]}
                                    onChange={(e) => handleTripLenMagChange(e)} >
                                        {estLengthMagnitudes.map(mag => (
                                            <MenuItem value={mag} key={mag}>
                                                {mag}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Collapse>
            <Collapse in={!date.unknown}>
                <Container maxWidth="sm">
                    <Box mt={8}>
                        <Typography variant="h6">
                            {date.roughly ? 'Select the earliest start and end dates for the trip below.' :
                            'Select the start and end dates for the trip below.'}
                        </Typography>
                    </Box>
                </Container>
                <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                    <Calendar dateRange={dateRange} onDateRangeChange={onDateRangeChange}
                    availability={availability} />
                </Box>
                {availability.data.userId && <Box mt={1} display={{xs: 'none', sm: 'block'}}>
                    <Grid container wrap="nowrap" alignItems="center" justifyContent="center">
                        <Grid item>
                            <Checkbox checked={Boolean(availability.ref['@ref'].id)}
                            onClick={() => toggleDisplayAvailability()}
                            id="toggleAvailability" />
                        </Grid>
                        <Grid item>
                            <label htmlFor="toggleAvailability">
                                <Typography variant="body1">
                                    Display Availability
                                </Typography>
                            </label>
                        </Grid>
                    </Grid>
                </Box>}
            </Collapse>
            {!date.unknown && <Box mt={3} mb={8}>
                <Grid container spacing={3} alignItems="center" justifyContent="center"
                sx={{flexDirection: {xs: 'column', sm: 'row'}}} wrap="nowrap">
                    {date.roughly && <Grid item>
                        <Typography variant="body1">
                            Between
                        </Typography>
                    </Grid>}
                    <Grid item>
                        <TextField type="date" InputLabelProps={{shrink: true}}
                         label={date.roughly ? 'Earliest Start' : 'Start'} value={date.start}
                         onChange={(e) => handleDateInputChange("start", e as ChangeEvent<HTMLInputElement>)} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            {date.roughly ? 'and' : 'to'}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField type="date" InputLabelProps={{shrink: true}}
                         label={date.roughly ? 'Latest End' : 'End'} value={date.end}
                         onChange={(e) => handleDateInputChange("end", e as ChangeEvent<HTMLInputElement>)} />
                    </Grid>
                </Grid>
            </Box>}
        </Box>
    )
}