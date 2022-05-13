import {Box, Container, Paper, Typography} from '@mui/material'
import Link from 'next/link'
import { OrangePrimaryButton } from '../../mui-customizations/buttons'

export default function NoInvites() {

    return (
        <Box>
            <Container maxWidth="md">
                <Paper>
                    <Box display="flex" alignItems="center" justifyContent="center" minHeight={500}>
                        <Box textAlign="center">
                            <Typography gutterBottom variant="h4">
                                Any pending Travel Group Invitation you have will appear here!
                            </Typography>
                            <Box mt={3}>
                                <Link href="/travel-groups/find">
                                    <a>
                                        <OrangePrimaryButton>
                                            Search for a Group
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