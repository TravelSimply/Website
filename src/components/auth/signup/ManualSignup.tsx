import React from 'react'
import {Props as SignInProps} from '../../forms/SignIn'
import {FormikHelpers} from 'formik'
import SignupForm from '../../forms/Signup'
import axios, { AxiosError } from 'axios'
import Router from 'next/router'

export default function ManualSignUp() {

    const onSubmit = async (vals:SignInProps['vals'], actions:FormikHelpers<SignInProps['vals']>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/auth/signup',
                data: vals
            })

            Router.push({
                pathname: '/auth/verifyemail',
                query: {email: vals.email}
            })
        } catch (e: any | AxiosError) {
            if (axios.isAxiosError(e) && e.response.status == 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    return (
        <SignupForm vals={{email: ''}} onSubmit={onSubmit} />
    )
}