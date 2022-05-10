import Close from "@mui/icons-material/Close";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroup, ClientUser, Ref } from "../../../../database/interfaces";
import { OrangeDensePrimaryButton, OrangePrimaryButton } from "../../../mui-customizations/buttons";
import Snackbar from '../../../misc/snackbars'
import axios from "axios";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: {'@ref': {id: string}}[];
    joinRequests: {'@ref': {id: string}}[];
}

export default function PreviewAction({user, travelGroup, invites, joinRequests}:Props) {

    const [isMember, setIsMember] = useState(false)
    const [hasRequested, setHasRequested] = useState(false)
    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    useMemo(() => setIsMember(travelGroup.data.members.includes(user.ref['@ref'].id)),[])
    useMemo(() => setHasRequested(joinRequests.length > 0), [])

    const inviteId = useMemo(() => invites[0] ? invites[0]['@ref'].id : null, [invites])
    const requestId = useMemo(() => joinRequests[0] ? joinRequests[0]['@ref'].id : null, [joinRequests])

    const [closeAlert, setCloseAlert] = useState(false)

    const sendJoinRequest = async () => {
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/join-requests/send`,
                data: {}
            })

            setHasRequested(true)
            setSnackbarMsg({type: 'success', content: 'Sent Join Request'})
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Sending Join Request'}) 
        }
        setLoading(false)
    }

    return (
        <Box>
            {
                isMember ? <Box>
                    {!closeAlert && <Alert  severity="info" action={<IconButton sx={{mt: -0.75}}
                    onClick={() => setCloseAlert(true)}>
                        <Close />
                    </IconButton>}>
                        <Typography variant="body1">
                            You are a member of this Travel Group!
                        </Typography>
                    </Alert>}
                </Box> : inviteId ? <Box>
                    <Alert severity="info">
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                You've been invited to join this Travel Group!
                            </Typography>
                            <OrangeDensePrimaryButton disabled={loading}>
                                Accept Invitation
                            </OrangeDensePrimaryButton>
                        </Box>
                    </Alert>
                </Box> : !hasRequested ? <Box>
                    <Alert severity="info">
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                You can request to join this group!
                            </Typography>
                            <OrangeDensePrimaryButton disabled={loading}
                            onClick={() => sendJoinRequest()}>
                                Request to Join
                            </OrangeDensePrimaryButton>
                        </Box>
                    </Alert>
                </Box> : <Box>
                    {!closeAlert && <Alert severity="info" action={<IconButton sx={{mt: -0.75}}
                    onClick={() => setCloseAlert(true)}>
                        <Close />
                    </IconButton>}>
                        <Typography variant="body1">
                            You have requested to join this group!
                        </Typography>
                    </Alert>}
                </Box>
            }
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}