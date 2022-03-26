import React from 'react'
import SignInForm from '../../forms/SignIn'
import {Props as SignInProps} from '../../forms/SignIn'
import {FormikHelpers} from 'formik'
import axios, {AxiosError} from 'axios'
import Router, {useRouter} from 'next/router'

export default function ManualSignIn() {

    const {query: {redirect}} = useRouter()

    const onSubmit = async (vals:SignInProps['vals'], actions:FormikHelpers<SignInProps['vals']>) => {
        try {
            await axios({
                method: 'POST',
                url: '/api/auth/signin',
                data: vals
            })

            Router.push({
                pathname: redirect.toString() || '/dashboard'
            }) 
        } catch (e) {
            if ((e as AxiosError).response.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    return (
        <SignInForm vals={{email: ''}} onSubmit={onSubmit} />
    )
}