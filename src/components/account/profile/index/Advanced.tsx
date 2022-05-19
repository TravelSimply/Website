import { Box, Dialog, DialogContent, DialogTitle, Divider, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { ClientUser } from "../../../../database/interfaces";
import { OrangePrimaryButton } from "../../../mui-customizations/buttons";
import DeleteAccountForm, {Props as DeleteAccountFormProps} from '../../../forms/DeleteAccount'
import { FormikHelpers } from "formik";

interface Props {
    user: ClientUser;
}

export default function Advanced({user}:Props) {

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onSubmit = (vals:DeleteAccountFormProps['vals'], actions:FormikHelpers<DeleteAccountFormProps['vals']>) => {

        console.log(vals)
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
                            Enter your password to delete your account. Note that this action is <b>irreversible</b>: your account 
                            information will be deleted.
                        </Typography>
                    </Box>
                    <Box>
                        <DeleteAccountForm vals={{password: ''}} onSubmit={onSubmit} />
                    </Box>
                </DialogContent>
            </Dialog>
        </Paper>
    )
}
