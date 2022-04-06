import { Box, RadioGroup, Radio, FormControl, FormControlLabel, Container, Grid, FormLabel, Typography, Collapse } from "@mui/material";
import Calendar from "../../calendar/Calendar";
import {ChangeEvent, useMemo} from 'react'
import dayjs, { Dayjs } from "dayjs";

export interface Props {
    date: {
        unknown: boolean;
        roughly: boolean;
        start: string;
        end: string;
    };
    setDate: (date:Props['date']) => void;
}

export default function DateSelection({date, setDate}:Props) {

    const handleCertaintyChange = (e:ChangeEvent<HTMLInputElement>) => {
        setDate({...date, unknown: e.target.value === 'unknown', roughly: e.target.value === 'roughly'})
    }

    const dateRange = useMemo<[Dayjs, Dayjs]>(() => {
        return [date.start ? dayjs(date.start) : null, date.end ? dayjs(date.end) : null]
    }, [date])

    const onDateChange = ([start, end]:[Dayjs, Dayjs]) => {
        setDate({...date, start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD')})
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
            <Collapse in={date.roughly}>
                <Calendar dateRange={dateRange} onDateRangeChange={onDateChange} />
                {/* earliest start and end */}
            </Collapse>
            <Collapse in={!date.unknown && !date.roughly}>
                <Calendar dateRange={dateRange} onDateRangeChange={onDateChange} />
                {/* start and end  */}
            </Collapse>
        </Box>
    )
}