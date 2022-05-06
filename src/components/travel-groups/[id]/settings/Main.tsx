import {useMemo, useState} from 'react'
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import {Box, Container, Divider, Paper, Typography, Grid} from '@mui/material'
import { PrimaryLink } from "../../../misc/links";

interface Props {
    travelGroup: ClientTravelGroup;
    user: ClientUser;
}

export default function Main({travelGroup:dbTravelGroup, user}:Props) {

    const [travelGroup, setTravelGroup] = useState(dbTravelGroup)

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
                        <Box p={2}>
                            <Box mb={3}>
                                <Typography variant="h4" gutterBottom>
                                    Travel Group Settings
                                </Typography>
                                <Box maxWidth={350}>
                                    <Divider sx={{bgcolor: 'primary.main', height: 2}} />
                                </Box>
                            </Box>
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
                            </Box>
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
        </Box>
    )
}