import ContactInfoForm, {Props as ContactInfoFormProps} from '../../../forms/ContactInfo'
import {FormikHelpers} from 'formik'
import axios from 'axios'
import { ClientContactInfo } from '../../../../database/interfaces'
import { Dispatch, SetStateAction } from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'

interface Props {
    contactInfo: ClientContactInfo;
    setSnackbarMsg: Dispatch<SetStateAction<{type:string;content:string}>>;
}

export default function ContactInfo({contactInfo, setSnackbarMsg}:Props) {

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
    )
}