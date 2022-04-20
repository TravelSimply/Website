import React, { useMemo, useState } from 'react'
import {Box, Container, FormGroup, Grid, MenuItem, Select, Typography, TextField} from '@mui/material'
import {Form, Formik, Field, useField, ErrorMessage, FormikHelpers} from 'formik'
import {FormikTextField, FormikPasswordField} from './FormikFields'
import {object, string, number, boolean, array, mixed, ref} from 'yup'
import {OrangePrimaryButton, OrangePrimaryIconButton, RedPrimaryIconButton} from '../mui-customizations/buttons'
import { ClientContactInfo } from '../../database/interfaces'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export interface Props {
    vals?: ClientContactInfo['data']['info'];
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

interface SocialMediaInputProps {
    val: string;
    remove: () => void;
    setFieldValue:any
}

export function SocialMediaInput({val, remove, setFieldValue}:SocialMediaInputProps) {

    const [selected, setSelected] = useState(val)

    const [username, setUsername] = useState('')

    useMemo(() => {
        setFieldValue(`socials.${selected}`, username)
    }, [username])

    return (
        <Box>
            <Grid container spacing={1} wrap="nowrap" alignItems="center">
                <Grid item>
                    <TextField select size="small" value={selected} onChange={(e) => setSelected(e.target.value)}>
                        <MenuItem dense value="whatsapp">
                            <img src="/whatsapp.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="discord">
                            <img src="/discord.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="facebook">
                            <img src="/facebook.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="groupme">
                            <img src="/groupme.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                    </TextField>
                </Grid> 
                <Grid sx={{flex: 1}} item>
                    <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Grid>
                <Grid item>
                    <RedPrimaryIconButton>
                        <RemoveIcon />
                    </RedPrimaryIconButton> 
                </Grid>
            </Grid>
        </Box>
    )
}

export default function SignIn({vals, onSubmit}:Props) {

    const initialVals = {
        ...vals,
        phones: vals?.phones || {},
        socials: vals?.socials || {}
    }

    const [socialInputs, setSocialInput] = useState(0)

    const addSocialInput = () => {
        setSocialInput(socialInputs + 1)
    }

    return (
        <Box>
            <Formik validationSchema={object({
                phones: object({
                    home: string().max(15),
                    mobile: string().max(15)
                }),
                email: string().email('Please enter a valid email.'),
                socials: object({
                    whatsapp: string().max(50),
                    discord: string().max(50),
                    facebook: string().max(50),
                    groupMe: string().max(50)
                })
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating, setFieldValue}) => (
                    <Form>
                        {JSON.stringify(values)}
                        <Box my={3}>
                            <Grid container spacing={3} justifyContent="space-around">
                                <Grid sx={{width: 'min(100%, 400px)'}} item>
                                    <Box mb={2} textAlign="center">
                                        <Typography variant="h6">
                                            Basic
                                        </Typography>
                                    </Box>
                                    <Box maxWidth={400}>
                                        <Box mb={3}>
                                            <FormGroup>
                                                <FormikTextField name="email" label="Email" />
                                            </FormGroup>
                                        </Box>
                                        <Box mb={3}>
                                            <FormGroup>
                                                <FormikTextField name="phones.home" label="Home Phone" />
                                            </FormGroup>
                                        </Box>
                                        <Box mb={3}>
                                            <FormGroup>
                                                <FormikTextField name="phones.mobile" label="Mobile Phone" />
                                            </FormGroup>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box mb={2}>
                                        <Grid container spacing={1} alignItems="center" justifyContent="center">
                                            <Grid item>
                                                <Typography variant="h6">
                                                    Social Media
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <OrangePrimaryIconButton
                                                onClick={() => addSocialInput()} disabled={socialInputs == 4}>
                                                    <AddIcon />
                                                </OrangePrimaryIconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box>
                                        {Array(socialInputs).fill(null).map((_, i) => (
                                            <Box key={i} mb={1}>
                                                <SocialMediaInput setFieldValue={setFieldValue} val="whatsapp" remove={() => {}} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box maxWidth={200} mx="auto">
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