import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {Box, FormGroup} from '@mui/material'
import {Form, Formik, FormikHelpers} from 'formik'
import {FormikSelectField, FormikTextField} from '../../FormikFields'
import {object, string} from 'yup'
import FormObserver from '../../FormObserver'
import { TravelGroup } from '../../../../database/interfaces'
import {MenuItem, Autocomplete, TextField} from '@mui/material'
import { getCountries, getStates, getCountry } from 'country-state-picker'

export interface Props {
    vals: TravelGroup['data']['destination'];
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext?: Dispatch<SetStateAction<any>>;
}

const possibleRegions = ['Interregional', 'U.S. & Canada', 'Central America', 'South America', 'Europe', 
    'Asia', 'Africa', 'Oceania', 'Antarctica'].sort()

export default function Destination({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    const countries = useMemo(() => getCountries(), [])

    const [countryCode, setCountryCode] = useState('')

    const states = useMemo(() => getStates(countryCode) || getStates(getCountry(vals.country)?.code || ''), [countryCode, vals])

    return (
        <Box>
            <Formik validationSchema={object({
                    region: string().oneOf(possibleRegions),
                    country: string(),
                    state: string().max(50),
                    city: string().max(50),
                    address: string().max(100)
                })}
                initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating, setFieldValue, touched}) => (
                    <Form>
                        {setFormContext && <FormObserver setFormContext={setFormContext} />}
                        <Box my={3}>
                            <FormGroup>
                                <FormikSelectField name="region" label="Region" value={values.region}>
                                    {possibleRegions.map(region => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </FormikSelectField>
                            </FormGroup>
                        </Box>
                        {values.region !== 'Interregional' && <Box my={3}>
                            <FormGroup>
                                <Autocomplete value={values.country} renderInput={(params) => (
                                    <TextField {...params} label="Country" error={touched.country && Boolean(errors.country)}
                                    helperText={touched.country && errors.country ? errors.country : ''} />
                                )} options={countries.map(country => country)} getOptionLabel={(option:any) => option.name || option} 
                                onChange={(e, value) => {
                                    setFieldValue('country', value?.name || '')
                                    setFieldValue('state', '')
                                    setFieldValue('city', '')
                                    setFieldValue('address', '')
                                    setCountryCode(value?.code || '')
                                }} />
                            </FormGroup>
                        </Box>}
                        {values.country && <Box my={3}>
                            <FormGroup>
                                <Autocomplete value={values.state} renderInput={(params) => (
                                    <TextField {...params} label="State/Province" error={touched.state && Boolean(errors.state)}
                                    helperText={touched.state && errors.state ? errors.state : ''} />
                                )} options={states} onChange={(e, value) => setFieldValue('state', value || '')} />
                            </FormGroup>
                       </Box>}
                        {values.state && <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="city" label="City" value={values.city} />
                            </FormGroup>
                        </Box>}
                        {values.city && <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="address" label="Address" value={values.address} />
                            </FormGroup> 
                        </Box>}
                    </Form>
                )}
            </Formik>
        </Box>
    )
}