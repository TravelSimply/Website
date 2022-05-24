import {Dispatch, SetStateAction, useMemo, useState} from 'react'
import {TravelGroupData} from '../../../../database/interfaces'
import {FormikHelpers, Formik, Form} from 'formik'
import {Autocomplete, Box, FormGroup, MenuItem, TextField, Divider} from '@mui/material'
import {string, object} from 'yup'
import FormObserver from '../../FormObserver'
import { FormikSelectField, FormikTextField } from '../../FormikFields'
import { getCountries, getCountry, getStates } from 'country-state-picker'

export interface Props {
    vals: {
        name: string;
        desc: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext: Dispatch<SetStateAction<any>>;
}

export default function Overview({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                name: string().required('Please enter a name.').max(70),
                desc: string().max(600)}
            )} 
            initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, setFieldValue, touched}) => (
                    <Form>
                        <FormObserver setFormContext={setFormContext} />
                        <Box mb={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="desc" label="Description" multiline rows={12} />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}