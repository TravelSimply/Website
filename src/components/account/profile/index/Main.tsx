import { Avatar, Box, Container, Grid, Paper, Typography, IconButton, Badge, CircularProgress, Divider } from '@mui/material';
import React, {useState, useRef, ChangeEvent, useMemo} from 'react'
import { ClientContactInfo, ClientPopulatedAvailability, ClientUser } from '../../../../database/interfaces';
import ContactInfoForm, {Props as ContactInfoFormProps} from '../../../forms/ContactInfo'
import {FormikHelpers} from 'formik'
import {OrangePrimaryButton, OrangePrimaryIconButton} from '../../../mui-customizations/buttons'
import axios, {AxiosError} from 'axios'
import Snackbar from '../../../misc/snackbars'
import dayjs from 'dayjs';
import SmallCalendar from '../../../calendar/SmallCalendar';
import Link from 'next/link'
import Profile from './Profile';

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
    contactInfo: ClientContactInfo;
}

export default function Main({user, availability, contactInfo}:Props) {

    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const availabilityMessage = useMemo(() => {
        if (!availability) {
            return 'Your availability for the next week is unknown.'
        }

        const counts = {
            unknown: 0,
            unavailable: 0,
            available: 0,
            travelling: 0
        }

        let day = dayjs().startOf('week')
        let weekText = 'this'
        if (dayjs().day() > 4) {
            day = dayjs().add(6, 'days').startOf('week')
            weekText = 'next'
        }

        const year = day.format('YYYY')
        for (let i = 0; i < 7; i++) {
            const format = day.format('MMDD')
            if (availability.data.dates[year]?.travelling?.includes(format)) {
                counts.travelling++
                continue
            }
            if (availability.data.dates[year]?.available.includes(format)) {
                counts.available++
                continue
            }
            if (availability.data.dates[year]?.unavailable.includes(format)) {
                counts.unavailable++
            }
            day = day.add(1, 'days')
        }

        if (counts.travelling > 0) {
            return `You are traveling ${counts.travelling} days ${weekText} week.`
        }
        if (counts.available > 0) {
            return `You are available to travel ${counts.available} days ${weekText} week.`
        }
        if (counts.unavailable > 3) {
            return `You are unavailable to travel most of ${weekText} week.`
        }
        return `Your availability for ${weekText} week is mostly unknown.`

    }, [availability])

    const onContactInfoSubmit = async (vals:ContactInfoFormProps['vals'], actions:FormikHelpers<ContactInfoFormProps['vals']>) => {

        try {

            await axios({
                method: 'POST',
                url: '/api/users/profile/contact-info/update',
                data: {
                    id: contactInfo.ref['@ref'].id,
                    info: vals
                }
            })

            setSnackbarMsg({type: 'success', content: 'Updated Contact Info Successfully'})
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Saving Contact Info'})
        }
    }

    return (
        <Box mx={3} pt={2}>
            <Box>
                <Container maxWidth="lg">
                    <Profile user={user} setSnackbarMsg={setSnackbarMsg} />
                </Container>
            </Box>
            <Box mt={3}>
                <Container maxWidth="lg">
                    <Paper>
                        <Box p={2}>
                            <Grid container spacing={3} alignItems="stretch" justifyContent="space-between">
                                <Grid item flexGrow={1}>
                                    <Grid container direction="column" justifyContent="space-between" sx={{height: "100%"}}>
                                        <Box>
                                            <Box textAlign="center" mb={3}>
                                                <Typography gutterBottom variant="h4">
                                                    Availablility
                                                </Typography>
                                                <Box maxWidth={200} mx="auto">
                                                    <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                                </Box>
                                            </Box>
                                            <Box textAlign="center">
                                                <Typography variant="h6">
                                                    {availabilityMessage}
                                                </Typography> 
                                            </Box>
                                        </Box>
                                        <Box mt={3} textAlign="center">
                                            <Link href="/profile/availability">
                                                <a>
                                                    <OrangePrimaryButton>
                                                        Update Availability
                                                    </OrangePrimaryButton>
                                                </a>
                                            </Link>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Box width={400}>
                                        <SmallCalendar availability={availability} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Box mt={3}>
                <Container maxWidth="lg">
                    <Paper>
                        <Box p={2}>
                            <Box mb={2} textAlign="center">
                                <Typography gutterBottom variant="h4">
                                    Contact Info
                                </Typography>
                                <Box maxWidth={200} mx="auto">
                                    <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                </Box>
                            </Box>
                            <Box mb={2} textAlign="center">
                                <Typography variant="body1">
                                    This information is only visible to users in your Travel Groups.
                                </Typography>
                            </Box>
                            <Box>
                                <ContactInfoForm vals={contactInfo.data.info} onSubmit={onContactInfoSubmit} />
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}