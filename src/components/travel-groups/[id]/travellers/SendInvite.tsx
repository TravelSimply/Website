import {useMemo, useState} from 'react'
import { Alert, AlertTitle, Collapse, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ClientTravelGroup, ClientTravelGroupInvitation, ClientTravelGroupInvitationWithToPopulated, ClientUser, TravelGroupInvitation } from "../../../../database/interfaces";
import UserAdder from '../../../account/profile/UserAdder';
import CloseIcon from '@mui/icons-material/Close'
import { OrangePrimaryButton } from '../../../mui-customizations/buttons';
import axios from 'axios';
import Snackbar from '../../../misc/snackbars'
import { mutate } from 'swr';

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: ClientTravelGroupInvitationWithToPopulated[];
}

export default function SendInvite({user, travelGroup, invites}:Props) {

    if (!invites) {
        return null
    }

    if (travelGroup.data.settings.invitePriveleges === 'ownerOnly' && 
        user.ref['@ref'].id !== travelGroup.data.owner) {
        return null
    }

    const [addedTravellers, setAddedTravellers] = useState<ClientUser[]>([])
    const [startingAddList, setStartingAddList] = useState<ClientUser[]>([])

    const [alert, setAlert] = useState('')
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [loading, setLoading] = useState(false)

    useMemo(() => {

        const addedUser = addedTravellers[addedTravellers.length - 1]

        if (!addedUser) {
            return
        }

        if (travelGroup.data.members.includes(addedUser.ref['@ref'].id)) {
            setAlert(`@${addedUser.data.username} is already in the group!`)
            return setStartingAddList(addedTravellers.slice(0, -1))
        }

        if (invites.find(inv => inv.data.to.ref['@ref'].id === addedUser.ref['@ref'].id)) {
            setAlert(`@${addedUser.data.username} is already invited!`)
            return setStartingAddList(addedTravellers.slice(0, -1))
        }

    }, [addedTravellers])

    const sendInvites = async () => {
        setLoading(true)

        const ids = addedTravellers.map(t => t.ref['@ref'].id)

        try {
            const {data: createdInvites} = await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations/send`,
                data: {
                    travelGroupId: travelGroup.ref['@ref'].id,
                    to: ids
                }
            }) as {data: ClientTravelGroupInvitation[]}

            setSnackbarMsg({type: 'success', content: 'Invites Sent Successfully'})
            setStartingAddList([]) 
            mutate(`/api/travel-groups/${travelGroup.ref['@ref'].id}/invitations`, 
            [...invites, ...createdInvites.map((inv, i) => {
                return {
                    ...inv,
                    data: {
                        ...inv.data,
                        to: addedTravellers[i]
                    }
                } 
            })], false)
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error inviting travelers'})
        }

        setLoading(false)
    }

    return (
        <Box>
            <Box maxWidth="sm" mx="auto">
                <Paper>
                    <Box p={2} minHeight={500} display="flex" flexDirection="column" justifyContent="space-between">
                        <Grid item>
                            <Box mb={2} textAlign="center">
                                <Typography variant="h6">
                                    Invite new Travellers!
                                </Typography>
                            </Box>
                            <UserAdder startingAddList={startingAddList} setAddedUsers={setAddedTravellers}>
                                {alert && <Box mt={1}>
                                    <Collapse in={Boolean(alert)}>
                                        <Alert severity="info" action={<IconButton size="small" onClick={() => setAlert('')}>
                                            <CloseIcon /> 
                                        </IconButton>}>
                                            <AlertTitle>{alert}</AlertTitle>
                                        </Alert>
                                    </Collapse>
                                </Box>}
                            </UserAdder>
                        </Grid>
                        <Grid item>
                            {addedTravellers.length > 0 && <Box mt={2}>
                                <Box maxWidth={200} mx="auto">
                                    <OrangePrimaryButton disabled={loading} fullWidth
                                    onClick={() => sendInvites()}>
                                        Invite
                                    </OrangePrimaryButton>
                                </Box>
                            </Box>}
                        </Grid>
                    </Box>
                </Paper>
            </Box>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}