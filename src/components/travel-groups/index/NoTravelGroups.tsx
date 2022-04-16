import { Box, Container, Paper, Typography } from "@mui/material";
import { OrangePrimaryButton } from "../../mui-customizations/buttons";
import Link from 'next/link'

export default function NoTravelGroups() {

    return (
        <Box>
            <Container maxWidth="md">
                <Paper>
                    <Box display="flex" alignItems="center" justifyContent="center" minHeight={500}>
                        <Box textAlign="center">
                            <Typography gutterBottom variant="h4">
                                No Travel Groups yet!
                            </Typography>
                            <Box mt={3}>
                                <Link href="/travel-groups/find">
                                    <a>
                                        <OrangePrimaryButton>
                                            Find A Group
                                        </OrangePrimaryButton>
                                    </a>
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}