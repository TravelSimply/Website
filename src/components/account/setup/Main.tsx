import { Box, Paper, Typography, Stepper, Step, StepLabel, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react'
import { ClientUser } from '../../../database/interfaces'
import Welcome from './Welcome'
import Username from './Username'
import Profile from './Profile';

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const labels = ['Username', 'Profile', 'Friends']

    const {query} = useRouter()

    const step = useMemo(() => query.step ? parseInt(query.step.toString()) : null, [query])

    return (
        <div>
            <Box maxWidth={600} mx="auto">
                <Paper elevation={5}>
                    <Box py={3} mx={3}>
                        {step === null ? <Welcome /> :
                            <>
                                <Box mb={5}>
                                    <Stepper alternativeLabel activeStep={step}>
                                        {Array(3).fill(null).map((_, i) => (
                                            <Step key={i} completed={i < step}>
                                                <StepLabel>
                                                    {labels[i]}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>
                                {step === 0 ? <Username /> :
                                step === 1 ? <Profile user={user} /> :
                                ''}
                            </>}
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}