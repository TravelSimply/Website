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
    socialSelected: string;
    remove: () => void;
    setFieldValue: (field:string, value:any) => void;
    changeSocial: (val:string) => void;
    username: string;
}

export function SocialMediaInput({socialSelected, remove, setFieldValue, changeSocial, username}:SocialMediaInputProps) {

    const updateUsername = (u:string) => {
        setFieldValue(`socials.${socialSelected}`, u)
    }

    const changeSocialSelected = (e:React.ChangeEvent<HTMLInputElement>) => {
        updateUsername('') 
        changeSocial(e.target.value)
    }

    const onUsernameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 49) return
        updateUsername(e.target.value)
    }

    return (
        <Box>
            <Grid container spacing={1} wrap="nowrap" alignItems="center">
                <Grid item>
                    <TextField select size="small" value={socialSelected} onChange={(e) => changeSocialSelected(e as any)}>
                        <MenuItem dense value="whatsapp">
                            <img src="/whatsapp.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="discord">
                            <img src="/discord.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="facebook">
                            <img src="/facebook.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                        <MenuItem dense value="groupMe">
                            <img src="/groupme.svg" style={{width: 32, height: 32}} />
                        </MenuItem>
                    </TextField>
                </Grid> 
                <Grid sx={{flex: 1}} item>
                    <TextField label="Username" value={username} onChange={onUsernameChange} />
                </Grid>
                <Grid item>
                    <RedPrimaryIconButton onClick={() => remove()}>
                        <RemoveIcon />
                    </RedPrimaryIconButton> 
                </Grid>
            </Grid>
        </Box>
    )
}

export default function ContactInfo({vals, onSubmit}:Props) {

    const initialVals = {
        ...vals,
        phones: vals?.phones || {},
        socials: vals?.socials || {}
    }

    const [socialInputs, setSocialInputs] = useState(Object.keys(initialVals.socials).filter(key => initialVals.socials[key]))

    const addSocialInput = (vals) => {
        setSocialInputs([...socialInputs, findNextSocial(vals)])
    }

    const findNextSocial = (vals:(typeof initialVals)) => {
        if (!vals?.socials?.whatsapp) return 'whatsapp'
        if (!vals?.socials?.discord) return 'discord'
        if (!vals?.socials?.groupMe) return 'groupMe'
        return 'facebook'
    }

    const changeSocial = (social:string, i:number) => {
        const socialCopy = [...socialInputs]
        socialCopy[i] = social
        setSocialInputs(socialCopy)
    }

    const removeSocial = (i:number, setFieldValue:((field:string, value:any) => void)) => {
        const socialsCopy = [...socialInputs]
        setFieldValue(`socials.${socialsCopy.splice(i, 1)[0]}`, '')
        setSocialInputs(socialsCopy)
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
                                                onClick={() => addSocialInput(values)} disabled={socialInputs.length == 4}
                                                sx={{padding: 0}}>
                                                    <AddIcon />
                                                </OrangePrimaryIconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box>
                                        {socialInputs.map((social, i) => (
                                            <Box key={social + i} mb={3}>
                                                <SocialMediaInput setFieldValue={setFieldValue} socialSelected={social}
                                                 remove={() => removeSocial(i, setFieldValue)} changeSocial={(val) => changeSocial(val, i)}
                                                 username={values.socials[social]} />
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