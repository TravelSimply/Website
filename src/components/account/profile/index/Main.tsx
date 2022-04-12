import { Avatar, Box, Container, Grid, Paper, Typography, IconButton, Badge, CircularProgress, Divider } from '@mui/material';
import React, {useState, useRef, ChangeEvent, useMemo} from 'react'
import { ClientPopulatedAvailability, ClientUser } from '../../../../database/interfaces';
import FullProfileForm, {Props as FullProfileFormProps} from '../../../forms/FullProfile'
import {FormikHelpers} from 'formik'
import CreateIcon from '@mui/icons-material/Create';
import {OrangePrimaryButton, OrangePrimaryIconButton} from '../../../mui-customizations/buttons'
import { PrimaryLink } from '../../../misc/links';
import axios, {AxiosError} from 'axios'
import Snackbar from '../../../misc/snackbars'
import { uploadImage } from '../../../../utils/images';
import Calendar from '../../../calendar/Calendar';
import dayjs from 'dayjs';
import SmallCalendar from '../../../calendar/SmallCalendar';
import Link from 'next/link'

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
}

export default function Main({user, availability}:Props) {

    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [uploadingImage, setUploadingImage] = useState(false)
    const [imgSrc, setImgSrc] = useState(user.data.image?.src)
    const imageInputRef = useRef<HTMLInputElement>()

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

    const onProfileFormSubmit = async (vals:FullProfileFormProps['vals'], actions:FormikHelpers<FullProfileFormProps['vals']>) => {

        try {
            const valsCopy ={...vals}
            delete valsCopy.email
            if (valsCopy.username === user.data.username) {
                delete valsCopy.username
            }

            await axios({
                method: 'POST',
                url: '/api/users/profile/update',
                data: {data: valsCopy}
            })

            setSnackbarMsg({type: 'success', content: 'Updated Profile Successfully'})
        } catch (e) {
            if ((e as AxiosError).response?.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
        }
        actions.setSubmitting(false)
    }

    const handleFileUpload = async (e:ChangeEvent<HTMLInputElement>) => {
        setUploadingImage(true)
        const file = e.target.files[0]

        try {
            const image = await uploadImage(file) 
            setImgSrc(image.src)
            setSnackbarMsg({type: 'success', content: 'Updated Image Successfully'})
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Uploading Image'})
        }

        setUploadingImage(false)
    }

    return (
        <Box mx={3} pt={2}>
            <Box>
                <Container maxWidth="lg">
                    <Paper>
                        <Box p={2}>
                            <Container maxWidth="md">
                                <Grid container spacing={3} justifyContent="space-around">
                                    <Grid item>
                                        <Box>
                                            <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={
                                                <Box borderRadius="50%" bgcolor="primary.main" >
                                                    <IconButton sx={{color: '#fff'}} onClick={() => imageInputRef.current.click()}>
                                                        <CreateIcon />
                                                    </IconButton>
                                                </Box>
                                                }>
                                                <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}}}
                                                src={imgSrc || '/default_profile.png'} 
                                                imgProps={{referrerPolicy: 'no-referrer'}} />
                                                <input ref={imageInputRef} style={{height: 0, width: 0}} type="file"
                                                onChange={(e) => handleFileUpload(e)} accept="image/*" />
                                                {uploadingImage && <Box position="absolute" top={0} left={0} height={200} width={200} display="flex" 
                                                justifyContent="center" alignItems="center" borderRadius="50%" sx={{backgroundColor: 'rgba(0, 0, 0, .6)'}} >
                                                    <CircularProgress size={60} thickness={4} />
                                                </Box>}
                                            </Badge>
                                        </Box>
                                        <Box mt={2} textAlign="center">
                                            <PrimaryLink href="/profile/friends">
                                                {user.data.friends?.length || 0} friends
                                            </PrimaryLink>
                                        </Box>
                                    </Grid>
                                    <Grid item sx={{minWidth: {xs: 300, sm: 400}}}>
                                        <Box>
                                            <FullProfileForm vals={{
                                                firstName: user.data.firstName || '',
                                                lastName: user.data.lastName || '',
                                                username: user.data.username || '',
                                                email: user.data.email
                                            }} onSubmit={onProfileFormSubmit} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Box>
                    </Paper>
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
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}