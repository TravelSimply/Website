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
        password: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

export default function SignIn({vals, onSubmit}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                password: string().required('Please enter a password.').min(8).max(128)
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikPasswordField type="password" name="password" label="Password" />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <OrangePrimaryButton type="submit" disabled={isSubmitting || isValidating} fullWidth>
                                Reset
                            </OrangePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}