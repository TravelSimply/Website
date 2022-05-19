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
import Availability from './Availability';

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
    contactInfo: ClientContactInfo;
}

export default function Main({user, availability, contactInfo}:Props) {

    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

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
                    <Availability availability={availability} />
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