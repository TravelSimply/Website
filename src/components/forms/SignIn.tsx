import React from 'react'
import {Box, FormGroup, Typography} from '@mui/material'
import {Form, Formik, Field, useField, ErrorMessage, FormikHelpers} from 'formik'
import {FormikTextField, FormikPasswordField} from './FormikFields'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {OrangePrimaryButton} from '../mui-customizations/buttons'
import Link from 'next/link'
import { PrimaryLink } from '../misc/links'

export interface Props {
    vals: {
        email: string;
        password?: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

export default function SignIn({vals, onSubmit}:Props) {

    const initialVals = {...vals, password: ''}

    return (
        <Box>
            <Formik validationSchema={object({
                email: string().required('Please enter your email.').email('Please enter a valid email.'),
                password: string().required('Please enter a password.')
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="email" label="Email" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikPasswordField type="password" name="password" label="Password" />
                            </FormGroup>
                            <Box mt={1}>
                                <PrimaryLink href="/auth/forgot-password" variant="subtitle2">
                                    Forgot your password?
                                </PrimaryLink>
                            </Box>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <OrangePrimaryButton type="submit" disabled={isSubmitting || isValidating} fullWidth>
                                Sign In
                            </OrangePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}