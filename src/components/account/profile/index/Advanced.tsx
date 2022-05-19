import { Alert, AlertTitle, Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Paper, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { ClientUser } from "../../../../database/interfaces";
import { OrangePrimaryButton } from "../../../mui-customizations/buttons";
import DeleteAccountForm, {Props as DeleteAccountFormProps} from '../../../forms/DeleteAccount'
import { FormikHelpers } from "formik";
import axios, { AxiosError } from "axios";
import CloseIcon from '@mui/icons-material/Close'
import { signOut } from "../../../../utils/auth";

interface Props {
    user: ClientUser;
    setSnackbarMsg: Dispatch<SetStateAction<{type:string;content:string}>>;
    notificationsId?: string;
}

export default function Advanced({user, setSnackbarMsg, notificationsId}:Props) {

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (vals:DeleteAccountFormProps['vals'], actions:FormikHelpers<DeleteAccountFormProps['vals']>) => {

        try {

            await axios({
                method: 'POST',
                url: '/api/users/delete',
                data: {
                    notificationsId,
                    password: vals.password
                }
            })

            signOut()
        } catch (e) {
            if ((e as AxiosError)?.response?.status === 409) {
                actions.setFieldError(e.response.data.field, e.response.data.msg)
            } else if ((e as AxiosError)?.response?.status === 400) {
                setError(e.response.data.msg)
            } else {
                setSnackbarMsg({type: 'error', content: 'Error Deleting Account'})
            }
            actions.setSubmitting(false)
        }
    }

    const deleteAccountNoPassword = async () => {

    }

    return (
        <Paper>
            <Box p={2}>
                <Box mb={2} textAlign="center">
                    <Typography gutterBottom variant="h4">
                        Advanced
                    </Typography>
                    <Box maxWidth={200} mx="auto">
                        <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                    </Box>
                </Box>
                <Box textAlign="center">
                    <OrangePrimaryButton onClick={() => setOpen(true)}>
                        Delete Account
                    </OrangePrimaryButton>
                </Box>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{textAlign: 'center'}}>
                    <Typography variant="h6">
                        Delete Your Account
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box textAlign="center">
                        <Typography variant="body1">
                            {!user.data.oAuthIdentifier && 'Enter your password to delete your account. '}Note that this action is <b>irreversible</b>: your account 
                            information will be deleted.
                        </Typography>
                    </Box>
                    {error && <Box my={3}>
                        <Alert severity="error" action={<IconButton size="small" onClick={() => setError('')}>
                            <CloseIcon />
                        </IconButton>}>
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    </Box>}
                    {!user.data.oAuthIdentifier?.google ? <Box>
                        <DeleteAccountForm vals={{password: ''}} onSubmit={onSubmit} />
                    </Box> : <Box my={3} textAlign="center">
                        <OrangePrimaryButton onClick={() => deleteAccountNoPassword()} disabled={loading}>
                            Delete Account     
                        </OrangePrimaryButton> 
                    </Box>}
                </DialogContent>
            </Dialog>
        </Paper>
    )
}
