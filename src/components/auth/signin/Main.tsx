import React from 'react'
import {LiteralUnion, ClientSafeProvider, signIn} from 'next-auth/react'
import {BuiltInProviderType} from 'next-auth/providers'
import {Box, Typography, Paper, Divider} from '@mui/material'
import {GoogleSignIn} from '../../mui-customizations/buttons'
import ManualSignIn from './ManualSignIn'
import Link from 'next/link'
import { PrimaryLink } from '../../misc/links'

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export default function Main({providers}:Props) {

    return (
        <div>
            <Box maxWidth={600} mx="auto">
                <Paper style={{borderRadius: 15}} elevation={5}>
                    <Box py={3} mx={3}>
                        <Box textAlign="center" mb={3}>
                            <Typography variant="h4">
                                Welcome 
                            </Typography>
                        </Box>
                        <Box my={3}>
                            <Box maxWidth={300} mx="auto">
                                <GoogleSignIn onClick={() => signIn(providers.google.id)} />
                            </Box>
                        </Box>
                        <Box my={3}>
                            <Box maxWidth={400} mx="auto">
                                <Divider>
                                    Or
                                </Divider>
                            </Box>
                        </Box>
                        <Box my={3}>
                            <Box maxWidth={400} mx="auto">
                                <ManualSignIn /> 
                            </Box>
                        </Box>
                    </Box>
                    <Divider />
                    <Box px={3} py={3} bgcolor="orangeBg.light">
                        <Box maxWidth={400} mx="auto">
                            <Typography display="inline" variant="body1">
                                New here?{' '}
                            </Typography>
                            <PrimaryLink href="/auth/signup" variant="body1">
                                Create an account.
                            </PrimaryLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}