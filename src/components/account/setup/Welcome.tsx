import { Box, Typography } from '@mui/material'
import React from 'react'
import { OrangePrimaryButton } from '../../mui-customizations/buttons'
import Router from 'next/router'

export default function Welcome() {

    return (
        <div>
            <Box textAlign="center" mb={3}>
                <Typography variant="h4">
                    Account Created!
                </Typography>
            </Box>
            <Box mb={3} textAlign="center" mx="auto">
                <Typography variant="h6">
                    You're account was successfully created. Now, you can begin setting up and customizing your account.
                    These settings can all be changed later.
                </Typography>
            </Box>
            <Box textAlign="center">
                <OrangePrimaryButton onClick={() => Router.push({query: {step: 0}})}>
                    Continue
                </OrangePrimaryButton>
            </Box>
        </div>
    )
}