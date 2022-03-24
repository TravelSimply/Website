import React, { useEffect, useState } from 'react'
import axios, {AxiosError} from 'axios'
import {Box, CircularProgress, Typography} from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorIcon from '@mui/icons-material/ErrorOutline'
import Link from 'next/link'
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
                    Verifying Account
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
                <Box mb={2} textAlign="center">
                    <Typography variant="h6">
                        Continue to finish setting up your account! 
                    </Typography>
                </Box>
                <Box textAlign="center">
                    <Link href="/account/setup">
                        <a>
                            <OrangePrimaryButton style={{minWidth: 200}}>
                                Continue
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
                        An error occurred while verifying your account. Please try verifying again later.
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
                        We couldn't find a verification token for your account. If you created your account over 3 days ago, the token
                        has expired and you will need to create a new account.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default function Verify({token}:Props) {

    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({success: false, tokenNotFound: false, serverError: false})

    useEffect(() => {
        const validateToken = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/api/auth/verifyemail',
                    data: {token}
                })
                setLoading(false)
                setResult({...result, success: true})
            } catch (e) {
                setLoading(false)
                if ((e as AxiosError).response.status === 500) {
                    setResult({...result, serverError: true})
                } else {
                    setResult({...result, tokenNotFound: true})
                }
            }
        }
        validateToken()
    }, [])

    return (
        <Box>
            <Box mx="auto" maxWidth={600}>
                {loading ? <LoadingScreen /> : 
                result.success ? <SuccessScreen /> :
                result.serverError ? <ErrorScreen /> :
                <TokenNotFoundScreen />}
            </Box>
        </Box>
    )
}