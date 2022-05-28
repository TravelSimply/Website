import { Alert, Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";
import CloseIcon from '@mui/icons-material/Close'
import { OrangeDensePrimaryButton } from "../../../../../mui-customizations/buttons";
import Snackbar from '../../../../../misc/snackbars'
import axios from "axios";

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function JoinBar({user, trip}:Props) {

    if (trip.data.members.includes(user.ref['@ref'].id)) return null

    const [close, setClose] = useState(false)
    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const joinTrip = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${trip.data.travelGroup.id}/trips/${trip.ref['@ref'].id}/join`,
                data: {}
            })

            setSnackbarMsg({type: 'success', content: 'Successfully Joined Trip'})
            setClose(true)
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Failed to Join Trip'})
            setLoading(false)
        }
    }

    return (
        <Box mb={close ? 0 : 3}>
            {!close && <Alert severity="info" action={<IconButton sx={{mt: -0.75}}
            onClick={() => setClose(true)}>
                <CloseIcon />
            </IconButton>}>
                <Box>
                    <Typography variant="body1" gutterBottom>
                        You are not currently in this trip.
                    </Typography>
                    <OrangeDensePrimaryButton disabled={loading} 
                    onClick={() => joinTrip()}>
                        Join Trip
                    </OrangeDensePrimaryButton>
                </Box> 
            </Alert>} 
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}