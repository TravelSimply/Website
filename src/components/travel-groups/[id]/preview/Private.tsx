import { Box, Container, Paper, Typography } from "@mui/material";
import {useRouter} from 'next/router'
import { OrangePrimaryButton } from "../../../mui-customizations/buttons";

export default function Private() {

    const router = useRouter()

    return (
        <Box m={3}>
            <Container maxWidth="sm">
                <Paper>
                    <Box minHeight={400} display="flex" justifyContent="center" alignItems="center" px={3}>
                        <Box textAlign="center">
                            <Typography variant="h6" gutterBottom>
                                This travel group is private. To preview it, you need to be invited first.
                            </Typography>
                            <OrangePrimaryButton sx={{minWidth: 200}} onClick={() => router.back()}>
                                Back
                            </OrangePrimaryButton>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}