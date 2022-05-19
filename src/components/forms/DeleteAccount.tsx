import { Box, FormGroup } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import { object, string } from "yup";
import { OrangePrimaryButton } from "../mui-customizations/buttons";
import { FormikTextField } from "./FormikFields";

export interface Props {
    vals: {
        password: string;
    };
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
}

export default function DeleteAccount({vals, onSubmit}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                password: string().required('Please enter your password.')
            })} initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({isSubmitting, isValidating}) => (
                    <Form>
                        <Box my={3}>
                            <FormGroup>
                                <FormikTextField name="password" label="Password" type="password" />
                            </FormGroup>
                        </Box>
                        <Box my={3} maxWidth={200} mx="auto">
                            <OrangePrimaryButton type="submit" disabled={isSubmitting || isValidating} fullWidth>
                                Delete Account
                            </OrangePrimaryButton>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}