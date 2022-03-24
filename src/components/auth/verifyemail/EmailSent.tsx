import React from 'react'
import EmailIcon from '@mui/icons-material/EmailOutlined';
import {PrimaryLink} from '../../misc/links'
import {Box, Typography, } from '@mui/material'

interface Props {
    email: string;
}

export default function EmailSent({email}:Props) {

    return (
        <Box>
            <Box maxWidth={600} mx="auto">
                <Box textAlign="center" mb={3}>
                    <EmailIcon style={{fontSize: 200}} color="secondary" />
                </Box>
                <Box textAlign="center">
                    <Typography display="inline" variant="h6">
                        We've just sent an email to <b>{email}</b>. Click the link you receive to verify it. If you don't receive an email
                        after a few minutes,{' '}
                    </Typography>
                    <PrimaryLink variant="h6" href="/auth/verifyemail">
                        resend it.
                    </PrimaryLink>
                </Box>
            </Box>
        </Box>
    )
}