import React, { useState, Dispatch, SetStateAction } from 'react'
import EmailForm, {Props as EmailFormProps} from '../../forms/Email'
import {FormikHelpers} from 'formik'
import axios, {AxiosError} from 'axios'
import {Box, Paper, Typography} from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'

interface SuccessScreenProps {
    setSuccess: Dispatch<SetStateAction<boolean>>;
}

export function SuccessScreen({setSuccess}:SuccessScreenProps) {

    return (
        <>
            <Box mb={3} textAlign="center">
                <CheckIcon color="secondary" style={{fontSize: 'clamp(100px, 30vw, 300px)'}} />
            </Box>
            <Box textAlign="center">
                <Box mb={1} textAlign="center">
                    <Typography variant="h3">
                        Email Sent 
                    </Typography>
                </Box>
                <Box mb={2} textAlign="center">
                    <Typography display="inline" variant="h6">
                        Follow the directions in the email you receive to reset your password. If you don't receive 
                        an email within a few minutes,{' '}
                    </Typography>
                    <Box onClick={() => setSuccess(false)} display="inline" sx={{'&:hover': {cursor: 'pointer'}}}>
                        <Typography display="inline" variant="h6" color="primary.main">
                            resend it.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default function Main() {

    const [success, setSuccess] = useState(false)

    const onSubmit = async (vals:EmailFormProps['vals'], actions:FormikHelpers<EmailFormProps['vals']>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/auth/forgot-password/send-email',
                data: vals
            })

            setSuccess(true)
        } catch (e) {
            if ((e as AxiosError).response?.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    return (
        <div>
            <Box maxWidth={600} mx="auto">
                {success ? <SuccessScreen setSuccess={setSuccess} /> :
                <Paper style={{borderRadius: 15}} elevation={5}>
                    <Box py={3} mx={3}>
                        <Box mb={3} textAlign="center">
                            <Typography variant="h4">
                                Reset Password
                            </Typography>
                        </Box>
                        <Box mb={2} maxWidth={400} mx="auto" textAlign="center">
                            <Typography variant="body1">
                                Enter your email to receive instructions for resetting your password.
                            </Typography>
                        </Box>
                        <Box my={3} mx="auto" maxWidth={400}>
                            <EmailForm vals={{email: ''}} onSubmit={onSubmit}  />
                        </Box>
                    </Box>
                </Paper>}
            </Box>
        </div>
    )
}