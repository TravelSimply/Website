import {Dispatch, SetStateAction} from 'react'
import {TravelGroupData} from '../../../../database/interfaces'
import {FormikHelpers, Formik, Form} from 'formik'
import {Box} from '@mui/material'
import {string, object} from 'yup'

interface Props {
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
                    </Form>
                )}
            </Formik>
        </Box>
    )
}