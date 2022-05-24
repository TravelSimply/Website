import { Box, Container, Paper, Step, StepLabel, Stepper, useMediaQuery, Grid, Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ClientPopulatedAvailability, ClientUser } from "../../../database/interfaces";
import {FormikContextType, FormikHelpers} from 'formik'
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../mui-customizations/buttons";
import GeneralForm from '../../forms/travel-groups/create/General'
import SettingsForm from '../../forms/travel-groups/create/Settings'
import CloseIcon from '@mui/icons-material/Close'
import Router from 'next/router'
import axios from "axios";
import Snackbar from '../../misc/snackbars'

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const displayLabels = useMediaQuery('(min-width:450px)')

    const [step, setStep] = useState(0)
    const [formContexts, setFormContexts] = useState<FormikContextType<any>[]>(Array(2).fill(null))
    const [destAlert, setDestAlert] = useState(true)
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const labels = useMemo(() => ['General', 'Settings'] ,[])

    const [totalInfo, setTotalInfo] = useState({
        owner: user.ref['@ref'].id,
        members: [user.ref['@ref'].id],
        name: '',
        desc: '',
        settings: {
            mode: 'public',
            invitePriveleges: 'ownerOnly',
            joinRequestPriveleges: 'ownerOnly'
        }
    })

    const updateTotalInfo = (values) => {
        if (step === 1) {
            setTotalInfo({...totalInfo, settings: values})
        } else {
            setTotalInfo({...totalInfo, ...values})
        }
    }

    const onSectionSubmit = (values, actions:FormikHelpers<any>) => {
        updateTotalInfo(values)
        if (step < 1) {
            return setStep(step + 1)
        }
    }

    const updateFormContext = (formContext:FormikContextType<any>) => {
        const contextCopy = [...formContexts]
        contextCopy[step] = formContext
        setFormContexts(contextCopy) 
    }

    const next = async () => {
        formContexts[step].setSubmitting(true)
        await formContexts[step].submitForm()
    }

    const back = () => {
        setStep(step - 1)
    }

    useEffect(() => {

        if (!creatingGroup) return

        const submit = async () => {
            try {

                const {data: {id}} = await axios({
                    method: 'POST',
                    url: '/api/travel-groups/create',
                    data: {data: totalInfo}
                })

                Router.push({pathname: `/travel-groups/${id}`})
            } catch (e) {
                setSnackbarMsg({type: 'error', content: 'Failed to create Travel Group'})
            }
            setCreatingGroup(false)
        }
        submit()

    }, [creatingGroup])

    const createGroup = async () => {
        await next()

        setCreatingGroup(true)
    }

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                <Paper elevation={5}>
                    <Box py={3} mx={3}>
                        <Box mb={5}>
                            <Stepper alternativeLabel activeStep={step}>
                                {labels.map((label, i) => (
                                    <Step key={label} completed={i < step}>
                                        <StepLabel>
                                            {displayLabels && label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        <Box minHeight="70vh" display="flex" flexDirection="column" justifyContent="space-between">
                            <Box>
                                <Container maxWidth="sm">
                                    {step === 0 ? <GeneralForm vals={{name: totalInfo.name, desc: totalInfo.desc}}
                                    onSubmit={onSectionSubmit} setFormContext={updateFormContext} /> : 
                                    step === 1 ? <SettingsForm vals={totalInfo.settings} onSubmit={onSectionSubmit}
                                    setFormContext={updateFormContext} /> : ''}
                                </Container>
                            </Box>
                            <Box mt={2}>
                                <Grid container spacing={3} justifyContent="center">
                                    {step !== 0 && <Grid item>
                                        <OrangeSecondaryButton onClick={() => back()} sx={{minWidth: 150}}>
                                            Back     
                                        </OrangeSecondaryButton> 
                                    </Grid>}
                                    <Grid item>
                                        {step < 1 ? <OrangePrimaryButton onClick={() => next()}
                                        disabled={formContexts[step]?.isSubmitting} sx={{minWidth: 150}}>
                                            Next
                                        </OrangePrimaryButton> : <OrangePrimaryButton onClick={() => createGroup()}
                                        disabled={formContexts[step]?.isSubmitting || creatingGroup} sx={{minWidth: 150}}>
                                            Finish     
                                        </OrangePrimaryButton>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}