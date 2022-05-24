import { Avatar, Box, Grid, Typography } from "@mui/material";
import { ClientTravelGroup } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface Props {
    travelGroup: ClientTravelGroup;
}

export default function Overview({travelGroup}:Props) {

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item>
                    <Box>
                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                        borderRadius: 2}}
                        src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                        variant="square" />
                    </Box>
                    <Box textAlign="center" mt={1}>
                        <Typography variant="body1">
                            {travelGroup.data.members.length} travelers
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Box>
                        <Box mb={2}>
                            <Typography variant="h4">
                                {travelGroup.data.name}     
                            </Typography>     
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
