import {Box, Grid} from '@mui/material'
import { PrimaryLink } from '../misc/links'

export default function MainFooter() {

    return (
        <Box py={3} bgcolor="orangeBg.light">
            <Grid container spacing={3} justifyContent="center">
                <Grid item>
                    <PrimaryLink href="/terms-of-service">
                        Terms of Service
                    </PrimaryLink>
                </Grid>
                <Grid item>
                    <PrimaryLink href="/privacy-policy">
                        Privacy Policy
                    </PrimaryLink>
                </Grid>
            </Grid>
        </Box>
    )
}