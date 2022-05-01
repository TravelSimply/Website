import { Avatar, Badge, Box, Grid, IconButton, CircularProgress } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import CreateIcon from '@mui/icons-material/Create'
import { ChangeEvent, useRef, useState } from "react";
import { FormikContextType, FormikHelpers } from "formik";
import OverviewForm, {Props as OverviewFormProps} from '../../../forms/travel-groups/modify/Overview'
import { OrangePrimaryButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";
import { uploadTempImage } from "../../../../utils/images";
import Snackbar from '../../../misc/snackbars'

interface Props {
    travelGroup: ClientTravelGroup;
    isAdmin: boolean;
    junkIds?: string[];
}

export default function EditOverview({travelGroup, isAdmin, junkIds}:Props) {

    const imageInputRef = useRef<HTMLInputElement>()

    const [img, setImg] = useState({src: travelGroup.data.image?.src, publicId: junkIds?.at(0) || undefined})
    const [uploadingImage, setUploadingImage] =  useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [formVals, setFormVals] = useState({
        name: travelGroup.data.name,
        desc: travelGroup.data.desc,
        destination: travelGroup.data.destination
    })

    const [formContext, setFormContext] = useState<FormikContextType<OverviewFormProps['vals']>>(null)

    const handleFileUpload = async (e:ChangeEvent<HTMLInputElement>) => {
        setUploadingImage(true)
        const file = e.target.files[0]

        try {
            const image = await uploadTempImage(file, junkIds || [], img?.publicId)
            setImg(image)
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Uploading Image'})
        }

        setUploadingImage(false)
    }

    const onFormSubmit = async (values:OverviewFormProps['vals'], actions:FormikHelpers<OverviewFormProps['vals']>) => {
        const filledVals = {
            ...values,
            destination: {
                ...values.destination,
                combo: [values.destination.region, values.destination.country, values.destination.state,
                     values.destination.city, values.destination.address].join('$$')
            }
        }
        const filteredVals:any = {}
        if (filledVals.name !== formVals.name) {
            filteredVals.name = filledVals.name
        }
        if (filledVals.desc !== formVals.desc) {
            filteredVals.desc = filledVals.desc
        }
        if (filledVals.destination.combo !== formVals.destination.combo) {
            filteredVals.destination = filledVals.destination
        }
        console.log('submitting')
        console.log('filteredVAls', filteredVals)
    }

    const handleProposeClick = () => {
        formContext.setSubmitting(true)
        formContext.submitForm()
    }

    console.log(img?.src)

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item>
                    <Box>
                        <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={
                            <Box borderRadius="50%" bgcolor="primary.main">
                                <IconButton sx={{color: '#fff'}} onClick={() => imageInputRef.current.click()}>
                                    <CreateIcon />
                                </IconButton>
                            </Box>
                            }>
                            <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                            borderRadius: 2}}
                            src={img?.src || '/default_travelgroup.png'} variant="square"
                            imgProps={{referrerPolicy: 'no-referrer'}} />
                            <input ref={imageInputRef} style={{height: 0, width: 0}} type="file"
                            onChange={(e) => handleFileUpload(e)} accept="image/*" />
                            {uploadingImage && <Box position="absolute" top={0} left={0} height={200} width={200} display="flex" 
                            justifyContent="center" alignItems="center" borderRadius="50%" sx={{backgroundColor: 'rgba(0, 0, 0, .6)'}} >
                                <CircularProgress size={60} thickness={4} />
                            </Box>}
                        </Badge>
                    </Box>
                </Grid>
                <Grid item flex={{sm: 1}} width={{xs: '100%', sm: 'auto'}}>
                    <Box>
                        <OverviewForm vals={formVals} onSubmit={onFormSubmit} setFormContext={setFormContext}  />
                    </Box>
                    <Box>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item>
                                <Box width={200}>
                                    <OrangePrimaryButton fullWidth 
                                    onClick={() => handleProposeClick()}>
                                        Propose
                                    </OrangePrimaryButton>
                                </Box>
                            </Grid>
                            {isAdmin && <Grid item>
                                <Box width={200}>
                                    <OrangeSecondaryButton fullWidth>
                                        Override
                                    </OrangeSecondaryButton>
                                </Box>
                            </Grid>}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}