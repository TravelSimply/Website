import { Box, Container, Paper, Step, StepLabel, Stepper, useMediaQuery, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientUser } from "../../../database/interfaces";
import {FormikContextType, FormikHelpers} from 'formik'
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../mui-customizations/buttons";
import GeneralForm from '../../forms/travel-groups/create/General'
import DestinationForm from '../../forms/travel-groups/create/Destination'

interface Props {
    user: ClientUser;
    travelDates: {start:{'@ts':string};end:{'@ts':string}}[];
}

export default function Main({user, travelDates}:Props) {

    const displayLabels = useMediaQuery('(min-width:450px)')

    const [step, setStep] = useState(0)
    const [formContexts, setFormContexts] = useState<FormikContextType<any>[]>(Array(4).fill(null))

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
            start: '',
            end: ''
        },
        settings: {
            mode: 'public',
            invitePriveleges: 'ownerOnly',
            joinRequestPriveleges: 'ownerOnly'
        }
    })

    const updateTotalInfo = (values) => {
        if (step === 1) {
            setTotalInfo({...totalInfo, destination: values})
        } else {
            setTotalInfo({...totalInfo, ...values})
        }
    }

    const onSectionSubmit = (values, actions:FormikHelpers<any>) => {
        updateTotalInfo(values)
        if (step < 3) {
            setStep(step + 1)
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
        updateTotalInfo(formContexts[step].values)
        setStep(step - 1)
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
                                    step === 1 ? <DestinationForm vals={totalInfo.destination as any} 
                                    onSubmit={onSectionSubmit} setFormContext={updateFormContext} /> : ''}
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
                                        {step < 3 ? <OrangePrimaryButton onClick={() => next()}
                                        disabled={formContexts[step]?.isSubmitting} sx={{minWidth: 150}}>
                                            Next
                                        </OrangePrimaryButton> : <OrangePrimaryButton sx={{minWidth: 150}}>
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
    )
}