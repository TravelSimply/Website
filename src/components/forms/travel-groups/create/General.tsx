import React, { Dispatch, SetStateAction } from 'react'
import {Box, FormGroup} from '@mui/material'
import {Form, Formik, FormikHelpers} from 'formik'
import {FormikTextField} from '../../FormikFields'
import {object, string} from 'yup'
import FormObserver from '../../FormObserver'

export interface Props {
    vals: {
        name: string;
        desc: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext?: Dispatch<SetStateAction<any>>;
}

export default function General({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                    name: string().required('Please enter a name.').max(70),
                    desc: string().max(600)
                })}
                initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating}) => (
                    <Form>
                        {setFormContext && <FormObserver setFormContext={setFormContext} />}
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="name" label="Name" />
                            </FormGroup>
                        </Box>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="desc" label="Description" multiline rows={12} />
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}