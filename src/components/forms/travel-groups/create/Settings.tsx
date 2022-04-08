import React, { Dispatch, SetStateAction } from 'react'
import {Box, FormControl, FormGroup, FormLabel, RadioGroup, Grid, Radio, Typography} from '@mui/material'
import {Form, Formik, FormikHelpers} from 'formik'
import {FormikTextField, RadioWithDesc} from '../../FormikFields'
import {object, string} from 'yup'
import FormObserver from '../../FormObserver'

export interface Props {
    vals: {
        mode: string;
        invitePriveleges: string;
        joinRequestPriveleges: string;
    }
    onSubmit: (vals:Props['vals'], actions:FormikHelpers<Props['vals']>) => void;
    setFormContext?: Dispatch<SetStateAction<any>>;    
}

export default function Settings({vals, onSubmit, setFormContext}:Props) {

    const initialVals = vals

    return (
        <Box>
            <Formik validationSchema={object({
                    mode: string().oneOf(["public", "private"]),
                    invitePriveleges: string().oneOf(["ownerOnly", "allMembers"]),
                    joinRequestPriveleges: string().oneOf(["ownerOnly", "allMembers"])
                })}
                initialValues={initialVals} onSubmit={(values, actions) => onSubmit(values, actions)}>
                {({values, errors, isSubmitting, isValidating, setFieldValue}) => (
                    <Form>
                        {setFormContext && <FormObserver setFormContext={setFormContext} />}
                        <Box my={3}>
                            <FormGroup>
                                <FormControl>
                                    <Typography variant="body1" color="text.secondary">Privacy</Typography>
                                    <RadioGroup value={values.mode} onChange={(e) => setFieldValue('mode', e.target.value)}>
                                        <Box my={1}>
                                            <RadioWithDesc value="public" selectedValue={values.mode} primaryText="Public"
                                            secondaryText="Anyone can preview this group and request to join." />
                                        </Box>
                                        <Box>
                                            <RadioWithDesc value="private" selectedValue={values.mode} primaryText="Private"
                                            secondaryText="Only people invited can preview and join the group." />
                                        </Box>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                        </Box>
                        <Box my={5}>
                            <FormGroup>
                                <FormControl>
                                    <Typography variant="body1" color="text.secondary">Invite Privileges</Typography>
                                    <RadioGroup value={values.invitePriveleges}
                                     onChange={(e) => setFieldValue('invitePriveleges', e.target.value)}>
                                         <Box my={1}>
                                             <RadioWithDesc value="ownerOnly" selectedValue={values.invitePriveleges} primaryText="Owner Only"
                                             secondaryText="Only the owner can invite travelers." />
                                         </Box>
                                         <Box>
                                             <RadioWithDesc value="allMembers" selectedValue={values.invitePriveleges} primaryText="Any Member"
                                             secondaryText="Any member can invite travelers." />
                                         </Box>
                                     </RadioGroup>
                                </FormControl>
                            </FormGroup>
                        </Box>
                        <Box my={5}>
                            <FormGroup>
                                <FormControl>
                                    <Typography variant="body1" color="text.secondary">Join Request Privileges</Typography>
                                    <RadioGroup value={values.joinRequestPriveleges}
                                    onChange={(e) => setFieldValue('joinRequestPriveleges', e.target.value)}>
                                        <Box my={1}>
                                            <RadioWithDesc value="ownerOnly" selectedValue={values.joinRequestPriveleges}
                                            primaryText="Owner Only" secondaryText="Only the owner can respond to join requests." />
                                        </Box>
                                        <Box>
                                            <RadioWithDesc value="allMembers" selectedValue={values.joinRequestPriveleges}
                                            primaryText="Any Member" secondaryText="Any member can respond to join requests." />
                                        </Box>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}