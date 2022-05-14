import { Box, Grid, Typography } from "@mui/material";

export default function FindTravelGroups() {

    return (
        <Box mx={3}>
            <Box textAlign="center">
                <Typography variant="h2" color="primary">
                    Find Travel Groups
                </Typography>
            </Box>
            <Box mt={1}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                        <Box width={{xs: 300, sm: 500}}>
                            <img src="/home/find-groups.svg" width="100%" />
                        </Box>
                    </Grid>
                    <Grid item flexBasis={500}>
                        <Box>
                            <Typography variant="h4" lineHeight={1.5}>
                                Search for your friends' groups that are looking for travelers!
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}