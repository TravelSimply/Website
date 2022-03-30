import { useRouter } from 'next/router';
import React, {useState, Dispatch, SetStateAction, useRef, ChangeEvent} from 'react'
import { ClientUser } from '../../../database/interfaces'
import ProfileForm, {Props as ProfileFormProps} from '../../forms/Profile'
import {FormikContextType, FormikHelpers} from 'formik'
import axios, { AxiosError } from 'axios';
import { Avatar, Box, CircularProgress, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { OrangePrimaryButton, OrangeSecondaryButton } from '../../mui-customizations/buttons';
import { uploadImage } from '../../../utils/images';

interface Props {
    user: ClientUser;
}

export default function Profile({user}:Props) {

    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const router = useRouter()

    const [uploadingImage, setUploadingImage] = useState(false)
    const [imgSrc, setImgSrc] = useState(user.data.image?.src)
    const imageInputRef = useRef<HTMLInputElement>()

    const [formContext, setFormContext]:[FormikContextType<ProfileFormProps['vals']>, 
        Dispatch<SetStateAction<FormikContextType<ProfileFormProps['vals']>>>] = useState(null)

    const onSubmit = async (vals:ProfileFormProps['vals'], actions:FormikHelpers<ProfileFormProps['vals']>) => {

        try {
            await axios({
                method: 'POST',
                url: '/api/users/profile/update',
                data: {data: vals} 
            })

            router.push('/account/setup?step=2', undefined, {shallow: true})
        } catch (e) {
            if ((e as AxiosError).response.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            }
            actions.setSubmitting(false)
        }
    }

    const nextClick = async () => {
        formContext.setSubmitting(true)
        await formContext.submitForm()
    }

    const handleFileUpload = async (e:ChangeEvent<HTMLInputElement>) => {
        setUploadingImage(true)
        const file = e.target.files[0]
        try {
            const image = await uploadImage(file)
            setImgSrc(image.src)
        } catch (e) {}
        setUploadingImage(false)
    }

    return (
        <Box minHeight="60vh" display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
                <Box mb={3} >
                    <Box maxWidth={400} mx="auto">
                        <ProfileForm vals={{firstName: user.data.firstName || '', lastName: user.data.lastName || ''}}
                        onSubmit={onSubmit} setFormContext={setFormContext} /> 
                    </Box>
                </Box>
                <Box mb={3}>
                    <Grid container justifyContent="space-between" sx={{maxWidth: 400, marginX: 'auto'}}>
                        <Grid xs={12} sm="auto" item>
                            <Box textAlign={smallScreen ? 'center' : 'left'}>
                                <Typography variant="body1">
                                    Profile Image
                                </Typography>
                            </Box>
                            <Box mb={1}>
                                <Box textAlign="center" mt={1}>
                                    <OrangeSecondaryButton disabled={uploadingImage} onClick={() => imageInputRef.current.click()}>
                                        Change Image
                                    </OrangeSecondaryButton>
                                </Box>
                            </Box>
                            <input ref={imageInputRef} style={{height: 0, width: 0}} type="file" onChange={(e) => handleFileUpload(e)}
                            accept="image/*" />
                        </Grid>     
                        <Grid xs={12} sm="auto" item>
                            <Box width={200} mx="auto">
                                <Box height={200} borderRadius="50%" overflow="hidden" position="relative">
                                    <img referrerPolicy={'no-referrer'} src={imgSrc || '/default_profile.png'} style={{
                                        backgroundColor: 'hsl(209, 93%, 72%)',
                                        height: 200,
                                        width: 200
                                    }} />
                                    {uploadingImage && <Box position="absolute" top={0} left={0} height={300} width={300} display="flex" 
                                    justifyContent="center" alignItems="center" sx={{backgroundColor: 'rgba(0, 0, 0, .6)'}} >
                                        <CircularProgress size={60} thickness={4} />
                                    </Box>}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid> 
                </Box>
            </Box>
            <Box display="flex" justifyContent="center">
                <Box minWidth={200}>
                    <OrangePrimaryButton onClick={() => nextClick()} disabled={formContext?.isSubmitting} fullWidth>
                        Next
                    </OrangePrimaryButton>
                </Box>
            </Box>
        </Box>
    )
}