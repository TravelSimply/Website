import { Avatar, Box, Grid, Typography } from "@mui/material";
import { ClientTravelGroup } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { getDestination as getGeneralDestination } from "../../index/TravelGroupCard";

interface Props {
    travelGroup: ClientTravelGroup;
}

export default function Overview({travelGroup}:Props) {

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item>
                    <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                    borderRadius: 2}}
                    src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                    variant="square" />
                </Grid>
                <Grid item>
                    <Box>
                        <Box mb={2}>
                            <Typography variant="h4">
                                {travelGroup.data.name}     
                            </Typography>     
                        </Box>
                        <Box ml={2} mb={2}>
                            <Grid container wrap="nowrap" alignItems="start">
                                <Grid item>
                                    <LocationOnIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                </Grid>
                                <Grid item>
                                    <Box ml={1}>
                                        {travelGroup.data.destination.address && <Typography variant="h6">
                                            {travelGroup.data.destination.address},
                                        </Typography>}
                                        <Typography variant="h6">
                                            {getGeneralDestination(travelGroup.data.destination)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box ml={2}>
                            <Typography variant="body1">
                                {travelGroup.data.desc}
                            </Typography>
                        </Box>
                    </Box> 
                </Grid>
            </Grid>
        </Box>
    )
}
