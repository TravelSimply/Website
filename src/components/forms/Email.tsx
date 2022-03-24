import React from 'react'
import {Box, FormGroup, Typography} from '@mui/material'
import {Form, Formik, Field, useField, ErrorMessage, FormikHelpers} from 'formik'
import {FormikTextField, FormikPasswordField} from './FormikFields'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {OrangePrimaryButton} from '../mui-customizations/buttons'

export interface Props {
    vals: {
        email: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

export default function SignIn({vals, onSubmit}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                email: string().required('Please enter your email.').email('Please enter a valid email.'),
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="email" label="Email" />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <OrangePrimaryButton type="submit" disabled={isSubmitting || isValidating} fullWidth>
                                Send
                            </OrangePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}