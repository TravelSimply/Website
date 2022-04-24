import { Box, ButtonGroup, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { ClientTravelGroup, ClientTravelGroupWithPopulatedTravellersAndContactInfo, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import { searchForUsers } from "../../../../utils/search";
import { darkPrimaryOnHover } from "../../../misc/animations";
import { PrimarySearchBar } from "../../../misc/searchBars";
import { OrangeButtonGroup } from "../../../mui-customizations/buttonGroup";
import TravellerCard from "./TravellerCard";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroupWithPopulatedTravellersAndContactInfo;
}

export default function Main({user, travelGroup}:Props) {

    const [mode, setMode] = useState('travellers')
    const modes = ['travellers', 'invites', 'requests']

    const [travellers, setTravellers] = useState(travelGroup.data.members)
    const [searchedTravellers, setSearchedTravellers] = useState(travellers)

    const [search, setSearch] = useState('')

    useMemo(() => {

        if (!search.trim()) {
            setSearchedTravellers(travellers)
        }

        setSearchedTravellers(searchForUsers(search, travellers) as ClientUserWithContactInfo[])
    }, [search])

    return (
        <Box>
            <Box mb={3} py={1} bgcolor="orangeBg.light" 
            borderBottom="1px solid rgba(0,0,0,0.34)">
                <Grid container wrap="nowrap">
                    <Grid item flex={1}>
                        <Box textAlign="center">
                            <Typography color="primary.main" variant="h4">
                                {travelGroup.data.name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "max(300px, 25%)"}} />
                </Grid>
            </Box>
            <Box>
                <Grid container wrap="nowrap">
                    <Grid item flex={1}>
                        <Box mb={4}>
                            <Box mb={1}>
                                <Box textAlign="center" color="text.secondary">
                                    <Typography variant="h4">
                                        Owner
                                    </Typography>
                                </Box>
                                <Box mx="auto" maxWidth={300}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Box>
                                <Grid container justifyContent="center">
                                    <Grid item flexBasis={600}>
                                        <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                                        traveller={travelGroup.data.members.find(m => m.ref['@ref'].id === travelGroup.data.owner)}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Box mb={3}>
                            <Box mb={1}>
                                <Box textAlign="center" color="text.secondary">
                                    <Typography variant="h4">
                                        Travelers
                                    </Typography>
                                </Box>
                                <Box mx="auto" maxWidth={300}>
                                    <Divider />
                                </Box>
                            </Box>
                            <Box textAlign="center" my={2}>
                                <OrangeButtonGroup selected={mode} setSelected={setMode} 
                                options={[
                                    {value: 'travellers', text: `${travellers.length} Travellers`},
                                    {value: 'invites', text: '0 Invites'},
                                    {value: 'requests', text: '0 Join Requests'}
                                ]} />
                            </Box>
                            <Box mb={2}>
                                <Box mx="auto" maxWidth="sm">
                                    <PrimarySearchBar search={search} setSearch={setSearch} />
                                </Box>
                            </Box>
                            <Box>
                                {mode === 'travellers' ? 
                                <Box>
                                    <Grid container alignItems="stretch" justifyContent="space-around">
                                        {searchedTravellers.map((member, i) => (
                                            <Grid item key={i} flexBasis={600} sx={{mb: 3, mx: 1}}>
                                                <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                                                traveller={member} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box> :
                                mode === 'invites' ?
                                <Box>
                                    Invites
                                </Box> :
                                <Box>
                                    Requests
                                </Box>
                                }
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item display={{xs: 'none', md: 'initial'}} flexBasis={{xs: 0, md: "max(300px, 25%)"}}>
                        <Box>
                            sidebar
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}