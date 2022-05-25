import { Alert, AlertTitle, Box, Collapse, Container, Grid, IconButton, Paper, Step, StepLabel, Stepper, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ClientTravelGroup, ClientTrip, ClientUser } from "../../../../../database/interfaces";
import {FormikContextType, FormikHelpers} from 'formik'
import GeneralForm, {Props as GeneralFormProps} from '../../../../forms/travel-groups/create/General'
import DestinationForm, {Props as DestinationFormProps} from '../../../../forms/travel-groups/create/Destination'
import { PrimaryLink } from "../../../../misc/links";
import {OrangePrimaryButton, OrangeSecondaryButton} from '../../../../mui-customizations/buttons'
import dayjs from "dayjs";
import CloseIcon from '@mui/icons-material/Close'
import Router from 'next/router'
import Snackbar from '../../../../misc/snackbars'
import axios from "axios";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

const NUM_STEPS = 2

export default function Main({user, travelGroup}:Props) {

    const displayLabels = useMediaQuery('(min-width:450px)')

    const [step, setStep] = useState(0)
    const [formContexts, setFormContexts] = useState<FormikContextType<any>[]>(Array(NUM_STEPS).fill(null))
    const [destAlert, setDestAlert] = useState(true)
    const [creatingTrip, setCreatingTrip] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const labels = useMemo(() => ['General', 'Destination'], [])

    const [totalInfo, setTotalInfo] = useState<ClientTrip['data']>({
        leader: user.ref['@ref'].id,
        members: [user.ref['@ref'].id],
        travelGroup: travelGroup.ref['@ref'].id,
        name: '',
        desc: '',
        destination: {
            combo: '',
            region: 'Interregional',
            country: '', city: '', state: '', address: '', extraInfo: ''
        },
        date: {
            unknown: true,
            start: {'@date': dayjs().format('YYYY-MM-DD')},
            end: {'@date': dayjs().format('YYYY-MM-DD')}
        }
    })

    useEffect(() => {
        if (!creatingTrip) return

        const createTrip = async () => {

            try {

                const {data: {id}} = await axios({
                    method: 'POST',
                    url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/trips/create`,
                    data: {
                        tripData: totalInfo
                    }
                })

                Router.push({pathname: `/travel-groups/${travelGroup.ref['@ref'].id}/trips/${id}`})
            } catch (e) {
                setSnackbarMsg({type: 'error', content: 'Failed to create Trip'}) 
                setCreatingTrip(false)
            }
        }

        createTrip()
    }, [creatingTrip])

    const goToNextStep = () => {
        if (step + 1 < NUM_STEPS) {
            setStep(step + 1)
        } else {
            setCreatingTrip(true)
        }
    }

    const udpateTotalInfo = (values) => {
        if (step === 0) {
            setTotalInfo({...totalInfo, ...values})
        } else {
            setTotalInfo({...totalInfo, destination: {...values,
                combo: [values.region, values.country, values.state, values.city, values.address].join('$$')
            }})
        }
    }

    const onGeneralSubmit = async (vals:GeneralFormProps['vals'], actions:FormikHelpers<GeneralFormProps['vals']>) => {
        udpateTotalInfo(vals)
        goToNextStep()
    }

    const onDestinationSubmit = async (vals:DestinationFormProps['vals'], actions:FormikHelpers<DestinationFormProps['vals']>) => {
        udpateTotalInfo(vals)
        goToNextStep()
    }

    const back = async () => {
        if (step === 0) return
        udpateTotalInfo(formContexts[step].values)
        setStep(step - 1)
    }

    const next = async () => {
        if (!formContexts[step]) return

        await formContexts[step].submitForm()
    }

    const updateFormContext = (formContext:FormikContextType<any>) => {
        const copy = [...formContexts]
        copy[step] = formContext
        setFormContexts(copy)
    }

    return (
        <Box mb={3}>
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Box textAlign="center">
                    <PrimaryLink href="/travel-groups/[id]" as={`/travel-groups/${travelGroup.ref['@ref'].id}`}
                        variant="h4">
                        {travelGroup.data.name}
                    </PrimaryLink>
                </Box>
            </Box>
            <Box>
                <Container maxWidth="md">
                    <Paper elevation={5}>
                        <Box p={3}>
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
                            <Box minWidth="70vh" display="flex" flexDirection="column" justifyContent="space-between">
                                <Box>
                                    <Container maxWidth="sm">
                                        {step === 1 && destAlert && <Box>
                                            <Collapse in={destAlert}>
                                                <Alert severity="info" action={<IconButton onClick={() => setDestAlert(false)}>
                                                    <CloseIcon /> 
                                                </IconButton>}>
                                                    <AlertTitle>
                                                        Provide the narrowest destination encompassing your trip as possible.     
                                                    </AlertTitle> 
                                                </Alert>
                                            </Collapse>
                                        </Box>}
                                        {step === 0 ? <GeneralForm vals={{name: totalInfo.name, desc: totalInfo.desc}}
                                        onSubmit={onGeneralSubmit} setFormContext={updateFormContext}  /> : 
                                        step === 1 ? <DestinationForm vals={totalInfo.destination} 
                                        onSubmit={onDestinationSubmit} setFormContext={updateFormContext} /> : ''}
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
                                            {step + 1 < NUM_STEPS ? <OrangePrimaryButton onClick={() => next()}
                                            disabled={formContexts[step]?.isSubmitting} sx={{minWidth: 150}}>
                                                Next
                                            </OrangePrimaryButton> : <OrangePrimaryButton onClick={() => next()}
                                            disabled={creatingTrip} sx={{minWidth: 150}}>
                                                Finish     
                                            </OrangePrimaryButton>}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}