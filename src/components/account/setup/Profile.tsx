import { useRouter } from 'next/router';
import React, {useState, Dispatch, SetStateAction} from 'react'
import { ClientUser } from '../../../database/interfaces'
import ProfileForm, {Props as ProfileFormProps} from '../../forms/Profile'
import {FormikContextType, FormikHelpers} from 'formik'
import axios, { AxiosError } from 'axios';

interface Props {
    user: ClientUser;
}

export default function Profile({user}:Props) {

    const router = useRouter()

    const [formContext, setFormContext]:[FormikContextType<ProfileFormProps['vals']>, 
        Dispatch<SetStateAction<FormikContextType<ProfileFormProps['vals']>>>] = useState(null)

    const onSubmit = async (vals:ProfileFormProps['vals'], actions:FormikHelpers<ProfileFormProps['vals']>) => {

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/update',
                data: vals
            })

            router.push('/account/setup?step=2', undefined, {shallow: true})
        } catch (e) {
            if ((e as AxiosError).response.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }
}