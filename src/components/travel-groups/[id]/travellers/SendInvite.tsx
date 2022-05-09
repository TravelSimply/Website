import {useMemo, useState} from 'react'
import { Alert, AlertTitle, Collapse, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ClientTravelGroup, ClientTravelGroupInvitation, ClientTravelGroupInvitationWithToPopulated, ClientUser, ClientUserWithContactInfo, TravelGroupInvitation } from "../../../../database/interfaces";
import UserAdder from '../../../account/profile/UserAdder';
import CloseIcon from '@mui/icons-material/Close'
import { OrangePrimaryButton } from '../../../mui-customizations/buttons';
import axios from 'axios';
import Snackbar from '../../../misc/snackbars'
import { mutate } from 'swr';
import RestrictedUserAdder from '../../../account/profile/RestrictedUserAdder';

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    invites: ClientTravelGroupInvitationWithToPopulated[];
    friends: string[];
    travellers: ClientUserWithContactInfo[];
}

export default function SendInvite({user, travelGroup, invites, friends, travellers}:Props) {

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

    const restrictedUsers = useMemo(() => {
        if (!friends) return []
        if (!travellers) return []

        return friends.filter(f => !travellers.find(t => t.data.username === f) && !invites.find(inv => inv.data.to.data.username === f))
    }, [friends])

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
                            <RestrictedUserAdder startingAddList={startingAddList} setAddedUsers={setAddedTravellers}
                            restrictedUsernames={restrictedUsers}>
                                {addedTravellers.length === 0 && <Box mt={1} textAlign="center">
                                    <Typography variant="body1">
                                        You can only invite friends not in this Travel Group.     
                                    </Typography>
                                </Box>}
                            </RestrictedUserAdder>
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