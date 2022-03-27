import { Box, Typography } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import UsernameForm, {Props as UsernameFormProps} from '../../forms/Username'
import {FormikHelpers, FormikContextType} from 'formik'
import { OrangePrimaryButton } from '../../mui-customizations/buttons'
import axios, {AxiosError} from 'axios'
import Router, {useRouter} from 'next/router'

export default function Username() {

    const router = useRouter()

    const [formContext, setFormContext]:[FormikContextType<UsernameFormProps['vals']>, 
        Dispatch<SetStateAction<FormikContextType<UsernameFormProps['vals']>>>] = useState(null)

    const onSubmit = async (vals:UsernameFormProps['vals'], actions:FormikHelpers<UsernameFormProps['vals']>) => {

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/change-username',
                data: vals
            })

            router.push('/account/setup?step=1', undefined, {shallow: true})
        } catch (e) {
            if ((e as AxiosError).response.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    const nextClick = async () => {
        formContext.setSubmitting(true)
        await formContext.submitForm()
    }

    return (
        <Box minHeight="60vh" display="flex" flexDirection="column" justifyContent="space-between">
            <Box mb={3} >
                <Box maxWidth={400} mx="auto">
                    <UsernameForm vals={{username: ''}} onSubmit={onSubmit} setFormContext={setFormContext} /> 
                </Box>
            </Box>
            <Box display="flex" justifyContent="center">
                <Box minWidth={200}>
                    <OrangePrimaryButton onClick={() => nextClick()} disabled={formContext?.isSubmitting} fullWidth>
                        Next
                    </OrangePrimaryButton>
                </Box>
            </Box>
        </Box>
    )
}