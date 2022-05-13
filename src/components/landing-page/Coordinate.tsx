import { Box, Grid, Typography } from "@mui/material";

export default function CoordinateTravelling() {

    return (
        <Box mx={3}>
            <Box mb={3} textAlign="center">
                <Typography variant="h2" color="primary">
                    Coordinate Traveling
                </Typography>
            </Box>
            <Box maxWidth="lg" mx="auto">
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} md={4}>
                        <Grid container height="100%" direction="column" justifyContent="space-between">
                            <Grid item>
                                <Box textAlign="center">
                                    <img src="/home/contact.svg" width={250} />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box textAlign="center" maxWidth={300} mx="auto">
                                    <Typography variant="h5">
                                        {`Find the best method of contact for everyone ${Array(20).fill(null).map(() => '\u00A0').join('')}`}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container height="100%" direction="column" justifyContent="space-between">
                            <Grid item>
                                <Box textAlign="center">
                                    <img src="/home/proposal.svg" width={250} />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box textAlign="center">
                                    <Typography variant="h5" maxWidth={300} mx="auto">
                                        Vote for changes to the destination, date, and more
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container height="100%" direction="column" justifyContent="space-between">
                            <Grid item>
                                <Box textAlign="center">
                                    <img src="/home/calendar.svg" width={250} />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box textAlign="center" maxWidth={300} mx="auto">
                                    <Typography variant="h5">
                                        Propose dates to travel based on travelers' availabilities
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}