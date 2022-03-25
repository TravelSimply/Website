import React, { useEffect, useState } from 'react'
import ResetPasswordForm, {Props as ResetPasswordFormProps} from '../../forms/ResetPassword'
import {FormikHelpers} from 'formik'
import axios, {AxiosError} from 'axios'
import {Box, Typography, CircularProgress, Paper} from '@mui/material'
import Link from 'next/link'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import { OrangePrimaryButton } from '../../mui-customizations/buttons'

interface Props {
    token: string;
}

export function LoadingScreen() {

    return (
        <>
            <Box mb={3} textAlign="center">
                <CircularProgress color="secondary" size="clamp(100px, 30vw, 300px)" />
            </Box>
            <Box textAlign="center">
                <Typography variant="h6">
                    Verifying Token
                </Typography>
            </Box>
        </>
    )
}

export function SuccessScreen() {

    return (
        <>
            <Box mb={3} textAlign="center">
                <CheckIcon color="secondary" style={{fontSize: 'clamp(100px, 30vw, 300px)'}} />
            </Box>
            <Box textAlign="center">
                <Box mb={1} textAlign="center">
                    <Typography variant="h3">
                        You're all set!
                    </Typography>
                </Box>
                <Box textAlign="center">
                    <Link href="/auth/signup">
                        <a>
                            <OrangePrimaryButton style={{minWidth: 200}}>
                                Sign In
                            </OrangePrimaryButton>
                        </a>
                    </Link>
                </Box>
            </Box>
        </>
    )
}

export function ErrorScreen() {

    return (
        <>
            <Box mb={3} textAlign="center">
                <ErrorIcon color="secondary" style={{fontSize: 'clamp(100px, 30vw, 300px)'}} />
            </Box>
            <Box textAlign="center">
                <Box mb={1} textAlign="center">
                    <Typography variant="h3">
                        Oops...
                    </Typography>
                </Box>
                <Box textAlign="center">
                    <Typography variant="h6">
                        An error occurred while resetting your password. Please try again later.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export function TokenNotFoundScreen() {

    return (
        <>
            <Box mb={3} textAlign="center">
                <ErrorIcon color="secondary" style={{fontSize: 'clamp(100px, 30vw, 300px)'}} />
            </Box>
            <Box textAlign="center">
                <Box mb={1} textAlign="center">
                    <Typography variant="h3">
                        Token Not Found
                    </Typography>
                </Box>
                <Box textAlign="center">
                    <Typography variant="h6">
                        We couldn't find a reset token for your account. If you requested to reset your password over 2 days ago, the token
                        has expired and you will need to request a new password reset.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default function Verify({token}:Props) {

    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({tokenError: false, serverError: false, success: false})

    const onSubmit = async (vals:ResetPasswordFormProps['vals'], actions:FormikHelpers<ResetPasswordFormProps['vals']>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/auth/forgot-password/reset',
                data: {...vals, token}
            })

            setResult({...result, success: true})
        } catch (e) {
            setResult({...result, serverError: true})
        }
    }

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/api/auth/forgot-password/verify-token',
                    data: {token}
                })
                setLoading(false)
            } catch (e) {
                if ((e as AxiosError).response?.status === 409) {
                    setLoading(false)
                    return setResult({...result, tokenError: true})
                }
                setLoading(false)
                setResult({...result, serverError: true})
            }
        }
        verifyToken()
    }, [])

    return (
        <Box>
            <Box maxWidth={600} mx="auto">
                {loading ? <LoadingScreen /> : 
                result.tokenError ? <TokenNotFoundScreen /> :
                result.serverError ? <ErrorScreen /> : 
                result.success ? <SuccessScreen /> :
                <Paper style={{borderRadius: 15}} elevation={5}>
                    <Box py={3} mx={3}>
                        <Box mb={3} textAlign="center">
                            <Typography variant="h4">
                                Reset Your Password
                            </Typography>
                        </Box>
                        <Box my={3} mx="auto" maxWidth={400}>
                            <ResetPasswordForm vals={{password: ''}} onSubmit={onSubmit} /> 
                        </Box>
                    </Box>
                </Paper>}
            </Box>
        </Box>
    )
}