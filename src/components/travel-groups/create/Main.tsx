import { Box, Container, Paper, Step, StepLabel, Stepper, useMediaQuery, Grid, Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientPopulatedAvailability, ClientUser } from "../../../database/interfaces";
import {FormikContextType, FormikHelpers} from 'formik'
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../mui-customizations/buttons";
import GeneralForm from '../../forms/travel-groups/create/General'
import DestinationForm from '../../forms/travel-groups/create/Destination'
import SettingsForm from '../../forms/travel-groups/create/Settings'
import CloseIcon from '@mui/icons-material/Close'
import DateSelection, {Props as DateProps} from "./DateSelection";
import Router from 'next/router'
import axios from "axios";
import Snackbar from '../../misc/snackbars'

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
}

export default function Main({user, availability}:Props) {

    const displayLabels = useMediaQuery('(min-width:450px)')

    const [step, setStep] = useState(0)
    const [formContexts, setFormContexts] = useState<FormikContextType<any>[]>(Array(4).fill(null))
    const [destAlert, setDestAlert] = useState(true)
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const labels = useMemo(() => ['General', 'Destination', 'Date', 'Settings'] ,[])

    const [totalInfo, setTotalInfo] = useState({
        owner: user.ref['@ref'].id,
        members: [user.ref['@ref'].id],
        name: '',
        desc: '',
        destination: {
            combo: '',
            region: 'Interregional',
            country: '', state: '', city: '', address: ''
        },
        date: {
            unknown: true,
            roughly: false,
            start: '',
            end: '',
            estLength: [7, 'days'] as [number, string]
        },
        settings: {
            mode: 'public',
            invitePriveleges: 'ownerOnly',
            joinRequestPriveleges: 'ownerOnly'
        }
    })

    const updateTotalInfo = (values) => {
        if (step === 1) {
            setTotalInfo({...totalInfo, destination: {
                ...values,
                combo: [values.region, values.country, values.state, values.city, values.address].join('$$')
            }})
        } else if (step === 3) {
            setTotalInfo({...totalInfo, settings: values})
        } else {
            setTotalInfo({...totalInfo, ...values})
        }
    }

    const onSectionSubmit = (values, actions:FormikHelpers<any>) => {
        updateTotalInfo(values)
        if (step < 3) {
            return setStep(step + 1)
        }
    }

    const updateFormContext = (formContext:FormikContextType<any>) => {
        const contextCopy = [...formContexts]
        contextCopy[step] = formContext
        setFormContexts(contextCopy) 
    }

    const next = async () => {
        if (step === 2) {
            return setStep(step + 1)
        }
        formContexts[step].setSubmitting(true)
        await formContexts[step].submitForm()
    }

    const back = () => {
        if (step !== 2) {
            updateTotalInfo(formContexts[step].values)
        }
        setStep(step - 1)
    }

    const setDate = (date:DateProps['date']) => {
        setTotalInfo({...totalInfo, date})
    }

    const createGroup = async () => {
        await next()
        setCreatingGroup(true)

        try {

            const {data: {id}} = await axios({
                method: 'POST',
                url: '/api/travel-groups/create',
                data: {data: totalInfo}
            })

            Router.push({pathname: `/travel-groups/${id}`})
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Failed to create Travel Group'})
            setCreatingGroup(false)
        }
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
                                    {step === 1 && destAlert && <Box>
                                        <Collapse in={destAlert}>
                                            <Alert severity="info" action={<IconButton onClick={() => setDestAlert(false)}>
                                                <CloseIcon /> 
                                            </IconButton>}>
                                                <AlertTitle>
                                                    Provide as detailed information about the destination as possible.     
                                                </AlertTitle> 
                                            </Alert>
                                        </Collapse>
                                   </Box>}
                                    {step === 0 ? <GeneralForm vals={{name: totalInfo.name, desc: totalInfo.desc}}
                                    onSubmit={onSectionSubmit} setFormContext={updateFormContext} /> : 
                                    step === 1 ? <DestinationForm vals={totalInfo.destination as any} 
                                    onSubmit={onSectionSubmit} setFormContext={updateFormContext} /> : 
                                    step === 3 ? <SettingsForm vals={totalInfo.settings} onSubmit={onSectionSubmit}
                                    setFormContext={updateFormContext} /> : ''}
                                </Container>
                                {step === 2 && <DateSelection date={totalInfo.date} setDate={setDate}
                                availability={availability} />}
                            </Box>
                            <Box mt={2}>
                                <Grid container spacing={3} justifyContent="center">
                                    {step !== 0 && <Grid item>
                                        <OrangeSecondaryButton onClick={() => back()} sx={{minWidth: 150}}>
                                            Back     
                                        </OrangeSecondaryButton> 
                                    </Grid>}
                                    <Grid item>
                                        {step < 3 ? <OrangePrimaryButton onClick={() => next()}
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