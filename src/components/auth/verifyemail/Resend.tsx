import React, {useState} from 'react'
import {Box, Typography, Paper} from '@mui/material'
import EmailForm, {Props as EmailFormProps} from '../../forms/Email'
import {FormikHelpers} from 'formik'
import axios, {AxiosError} from 'axios'
import Router from 'next/router'

export default function Resend() {

    const onSubmit = async (vals:EmailFormProps['vals'], actions:FormikHelpers<EmailFormProps['vals']>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/auth/verifyemail/resend',
                data: vals
            })

            Router.push({
                pathname: '/auth/verifyemail',
                query: {email: vals.email}
            })

        } catch (e) {
            if ((e as AxiosError).response.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    return (
        <div>
            <Box maxWidth={600} mx="auto">
                <Paper style={{borderRadius: 15}} elevation={5}>
                    <Box py={3} mx={3}>
                        <Box mb={3} textAlign="center">
                            <Typography variant="h4">
                                Resend Verification Email
                            </Typography>
                        </Box>
                        <Box my={3} mx="auto" maxWidth={400}>
                            <EmailForm vals={{email: ''}} onSubmit={onSubmit} /> 
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}