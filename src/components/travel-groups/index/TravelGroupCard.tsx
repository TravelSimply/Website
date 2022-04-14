import { Avatar, Box, Grid, Paper } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../database/interfaces";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export default function TravelGroupCard({user, travelGroup}:Props) {

    return (
        <Box py={3}>
            <Paper>
                <Box>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Box>
                                <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}, 
                                borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10}}
                                src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                                variant="square" />
                            </Box>
                        </Grid>
                        <Grid item>
                            main stuff
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}