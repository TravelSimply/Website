import React from 'react'
import SignInForm from '../../forms/SignIn'
import {Props as SignInProps} from '../../forms/SignIn'
import {FormikHelpers} from 'formik'

export default function ManualSignIn() {

    const onSubmit = async (vals:SignInProps['vals'], actions:FormikHelpers<SignInProps['vals']>) => {
        console.log(vals)
        console.log(actions)
    }

    return (
        <SignInForm vals={{email: ''}} onSubmit={onSubmit} />
    )
}