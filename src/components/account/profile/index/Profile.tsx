import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import { ClientUser } from "../../../../database/interfaces"
import FullProfileForm, {Props as FullProfileFormProps} from '../../../forms/FullProfile'
import {FormikHelpers} from 'formik'
import axios, { AxiosError } from "axios"
import { uploadImage } from "../../../../utils/images"
import { Avatar, Badge, Box, CircularProgress, Container, Grid, IconButton, Paper } from "@mui/material"
import CreateIcon from '@mui/icons-material/Create'
import { PrimaryLink } from "../../../misc/links"

interface Props {
    user: ClientUser;
    setSnackbarMsg: Dispatch<SetStateAction<{type:string;content:string}>>;
}

export default function Profile({user, setSnackbarMsg}:Props) {

    const [uploadingImage, setUploadingImage] = useState(false)
    const [imgSrc, setImgSrc] = useState(user.data.image?.src)
    const imageInputRef = useRef<HTMLInputElement>()

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
            setSnackbarMsg({type: 'error', content: 'Error Updating Profile'})
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
    )
}