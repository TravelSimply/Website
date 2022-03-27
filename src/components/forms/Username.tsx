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
        username: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext?: Dispatch<SetStateAction<any>>;
}

export default function Username({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                username: string().required('Please enter a username').matches(/^[a-zA-Z0-9_]*$/, 'Can only contain letters, numbers, and underscores')
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        {setFormContext && <FormObserver setFormContext={setFormContext} />}
                        <Box my={3}>
                            <FormGroup>
                                <FormikUsernameField name="username" label="Username" InputProps={{startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon />
                                    </InputAdornment>
                                )}} />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}