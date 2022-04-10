import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { ClientPopulatedAvailability } from "../../../../../database/interfaces";
import Calendar from "../../../../calendar/Calendar";
import { OrangePrimaryButton } from "../../../../mui-customizations/buttons";

interface Props {
    availability: ClientPopulatedAvailability;
}

export default function Main({availability}:Props) {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([null, null])

    const onDateRangeChange = (dateRange:[Dayjs, Dayjs]) => {

    }

    const legend = useMemo(() => {
        return [{color: '#fff', value: 'Unknown'}, {color: 'rgba(0,0,0,0.5)', value: 'Unavailable'},
        {color: 'hsl(209, 93%, 92%)', value: 'Available'}, {color: 'hsl(30, 96%, 45%)', value: 'Traveling'}]
    }, [])

    return (
        <Box m={3}>
            <Container maxWidth="lg">
                <Paper>
                    <Box p={1}>
                        <Box mb={3}>
                            <Grid container spacing={3}>
                                <Grid item width={{md: 'auto', xs: '100%'}}>
                                    <Box minWidth={{md: 850, xs: '100%'}}>
                                        <Calendar dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
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