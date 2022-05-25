import { Box, Paper, Typography } from "@mui/material";
import Link from 'next/link'
import { enlargeOnHover } from "../../../../misc/animations";
import AddIcon from '@mui/icons-material/Add';

interface Props {
    travelGroupId: string;
}

export default function CreateTripCard({travelGroupId}:Props) {

    return (
        <Box py={3}>
            <Link href="/travel-groups/[id]/trips/create"
            as={`/travel-groups/${travelGroupId}/trips/create`}>
                <a>
                    <Paper sx={{...enlargeOnHover}}>
                        <Box display="flex" alignItems="center" justifyContent="center"
                        minHeight={100}>
                            <Box my={3}>
                                <Box>
                                    <Typography variant="h5" color="primary">
                                        Create a New Trip
                                    </Typography>
                                </Box>
                                <Box textAlign="center">
                                    <AddIcon sx={{color: 'primary.main', fontSize: 70}} />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </a>
            </Link>
        </Box>
    )
}