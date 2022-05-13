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
        destination: TravelGroupData['destination']
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext: Dispatch<SetStateAction<any>>;
}

const possibleRegions = ['Interregional', 'U.S. & Canada', 'Central America', 'South America', 'Europe', 
    'Asia', 'Africa', 'Oceania', 'Antarctica'].sort()

export default function Overview({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    const countries = useMemo(() => getCountries(), [])

    const [countryCode, setCountryCode] = useState('')

    const states = useMemo(() => getStates(countryCode) || getStates(getCountry(vals.destination.country)?.code || '') || [], [countryCode, vals])

    return (
        <Box>
            <Formik validationSchema={object({
                name: string().required('Please enter a name.').max(70),
                desc: string().max(600),
                destination: object({
                    region: string().oneOf(possibleRegions),
                    country: string(),
                    state: string().max(50),
                    city: string().max(50),
                    address: string().max(100)
                })
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
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
                        <Divider>Destination</Divider> 
                        <Box my={3}>
                            <FormGroup>
                                <FormikSelectField name="destination.region" label="Region" value={values.destination.region}>
                                    {possibleRegions.map(region => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </FormikSelectField>
                            </FormGroup>
                        </Box>
                        {values.destination.region !== 'Interregional' && <Box my={3}>
                            <FormGroup>
                                <Autocomplete value={values.destination.country} renderInput={(params) => (
                                    <TextField {...params} label="Country" error={touched.destination?.country && Boolean(errors.destination?.country)}
                                    helperText={touched.destination?.country && errors.destination?.country ? errors.destination?.country : ''} />
                                )} options={[...countries, ""]} getOptionLabel={(option:any) => option.name || option} 
                                onChange={(e, value) => {
                                    setFieldValue('destination.country', value?.name || '')
                                    setFieldValue('destination.state', '')
                                    setFieldValue('destination.city', '')
                                    setFieldValue('destination.address', '')
                                    setCountryCode(value?.code || '')
                                }} isOptionEqualToValue={(option, value) => option?.name === value || option === value} />
                            </FormGroup>
                        </Box>}
                        {values.destination.country && <Box my={3}>
                            <FormGroup>
                                <Autocomplete value={values.destination.state} renderInput={(params) => (
                                    <TextField {...params} label="State/Province" error={touched.destination?.state && Boolean(errors.destination?.state)}
                                    helperText={touched.destination?.state && errors.destination?.state ? errors.destination?.state : ''} />
                                )} options={[...states, ""]} onChange={(e, value) => setFieldValue('destination.state', value || '')} />
                            </FormGroup>
                       </Box>}
                        {values.destination.state && <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="destination.city" label="City" value={values.destination.city} />
                            </FormGroup>
                        </Box>}
                        {values.destination.city && <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="destination.address" label="Address" value={values.destination.address} />
                            </FormGroup> 
                        </Box>}
                    </Form>
                )}
            </Formik>
        </Box>
    )
}