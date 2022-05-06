import {useMemo, useState} from 'react'
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import {Box, Container, Divider, Paper, Typography, Grid} from '@mui/material'
import { PrimaryLink } from "../../../misc/links";
import { OrangePrimaryButton, OrangePrimaryIconButton } from '../../../mui-customizations/buttons';
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import SettingsForm, {Props as SettingsFormProps} from '../../../forms/travel-groups/create/Settings'
import { FormikContextType, FormikHelpers, FormikContext } from 'formik';
import Snackbar from '../../../misc/snackbars'
import axios from 'axios';

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export default function Main({travelGroup:dbTravelGroup, user}:Props) {

    const [travelGroup, setTravelGroup] = useState(dbTravelGroup)
    const [settingsFormContext, setSettingsFormContext] = useState<FormikContextType<SettingsFormProps['vals']>>(null)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const settings = useMemo(() => {
        const items = []
        if (travelGroup.data.settings.mode === 'public') {
            items.push({name: 'Privacy', value: 'Public', desc: 'Anyone can preview this group and request to join.'})
        } else {
            items.push({name: 'Privacy', value: 'Private', desc: 'Only people invited can preview and join the group.'})
        }
        if (travelGroup.data.settings.invitePriveleges === 'ownerOnly') {
            items.push({name: 'Invite Priveleges', value: 'Owner Only', desc: 'Only the owner can invite travelers.'})
        } else {
            items.push({name: 'Invite Priveleges', value: 'Any Member', desc: 'Any member can invite travelers.'})
        }
        if (travelGroup.data.settings.joinRequestPriveleges === 'ownerOnly') {
            items.push({name: 'Join Request Priveleges', value: 'Owner Only', desc: 'Only the owner can respond to join requests.'})
        } else {
            items.push({name: 'Join Request Priveleges', value: 'Any Member', desc: 'Any member can respond to join requests.'})
        }
        return items
    }, [travelGroup])

    const onSettingsFormSubmit = async (vals:SettingsFormProps['vals'], actions:FormikHelpers<SettingsFormProps['vals']>) => {

        if (JSON.stringify(travelGroup.data.settings) === JSON.stringify(vals)) {
            setEditing(false)
            setSnackbarMsg({type: 'success', content: 'Updated Settings'})
            return
        }

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/update`,
                data: {
                    data: {settings: vals}
                }
            })

            setEditing(false)
            setTravelGroup({
                ...travelGroup,
                data: {
                    ...travelGroup.data,
                    settings: vals as ClientTravelGroup['data']['settings']
                }
            })
            setSnackbarMsg({type: 'success', content: 'Updated Settings'})
        } catch (e) {
            setLoading(false)
            setSnackbarMsg({type: 'error', content: 'Error Updating Settings'})
        }
    }

    const update = () => {
        setLoading(true)
        settingsFormContext.submitForm()
    }

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" borderBottom="1px solid rgba(0,0,0,0.34)">
                <Box textAlign="center">
                    <PrimaryLink href="/travel-groups/[id]" as={`/travel-groups/${travelGroup.ref['@ref'].id}`}
                        variant="h4">
                        {travelGroup.data.name}
                    </PrimaryLink>
                </Box>
            </Box>
            <Container maxWidth="md">
                <Box>
                    <Paper>
                        <Box position="relative" p={2}>
                           <Box mb={3}>
                                <Typography variant="h4" gutterBottom>
                                    Travel Group Settings
                                </Typography>
                                <Box maxWidth={350}>
                                    <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                </Box>
                            </Box>
                            {editing ? <Box>
                                <SettingsForm vals={travelGroup.data.settings} onSubmit={onSettingsFormSubmit}
                                setFormContext={setSettingsFormContext} /> 
                                <Box>
                                    <OrangePrimaryButton disabled={loading} sx={{minWidth: 200}}
                                    onClick={() => update()}>
                                        Update
                                    </OrangePrimaryButton>
                                </Box>
                            </Box> : 
                            <Box>
                                {settings.map(setting => (
                                    <Box my={3} key={setting.name}>
                                        <Grid container spacing={{xs: 0, sm: 3}} alignItems="center">
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="body1">
                                                    {setting.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item flex={1}>
                                                <Box>
                                                    <Typography fontSize={{xs: 'body1', sm: 'h6'}}>
                                                        {setting.value}
                                                    </Typography>
                                                </Box>
                                                <Typography color="text.secondary" variant="body2">
                                                    {setting.desc}    
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))} 
                            </Box>}
                            {user.ref['@ref'].id === travelGroup.data.owner && <Box position="absolute"
                            top={0} right={0}>
                                <OrangePrimaryIconButton onClick={() => setEditing(!editing)}>
                                    {editing ? <CancelIcon sx={{fontSize: 30}} /> : 
                                    <EditIcon sx={{fontSize: 30}} />}
                                </OrangePrimaryIconButton> 
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
                <Box mt={3}>
                    <Paper>
                        <Box p={2}>
                            <Box mb={3}>
                                <Typography variant="h4" gutterBottom>
                                    Advanced
                                </Typography>
                                <Box maxWidth={170}>
                                    <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}