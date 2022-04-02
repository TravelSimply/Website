import React, { Dispatch, SetStateAction } from 'react'
import {Box, FormGroup, InputAdornment, Typography} from '@mui/material'
import {Form, Formik, Field, useField, ErrorMessage, FormikHelpers} from 'formik'
import {FormikTextField, FormikPasswordField, FormikUsernameField} from './FormikFields'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {OrangePrimaryButton} from '../mui-customizations/buttons'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import FormObserver from './FormObserver'

export interface Props {
    vals: {
        firstName: string;
        lastName: string;
        username: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

export default function Profile({vals, onSubmit}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                firstName: string(),
                lastName: string(),
                username: string().required('Please enter a username').max(30).matches(/^[a-zA-Z0-9_]*$/, 'Can only contain letters, numbers, and underscores')
                })}
                initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="firstName" label="First Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="lastName" label="Last Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikUsernameField name="username" label="Username" InputProps={{startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon />
                                    </InputAdornment>
                                )}} />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <OrangePrimaryButton type="submit" disabled={isSubmitting || isValidating} fullWidth>
                                Update
                            </OrangePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}