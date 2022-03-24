import React from 'react'
import {Props as SignInProps} from '../../forms/SignIn'
import {FormikHelpers} from 'formik'
import SignupForm from '../../forms/Signup'

export default function ManualSignUp() {

    const onSubmit = async (vals:SignInProps['vals'], actions:FormikHelpers<SignInProps['vals']>) => {
        console.log(vals)
        console.log(actions)
    }

    return (
        <SignupForm vals={{email: ''}} onSubmit={onSubmit} />
    )
}