import { ClientTravelGroup, ClientTravelGroupProposalWithByPopulated } from "../../../../database/interfaces";
import {useMemo} from 'react'
import { Container, Dialog, Box, Paper, Grid, Avatar, Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close'
import {getDestination as getGeneralDestination} from '../../index/TravelGroupCard'

interface Props {
    open: boolean;
    close: () => void;
    travelGroup: ClientTravelGroup;
    proposal: ClientTravelGroupProposalWithByPopulated;
}

export default function ProposalPreview({open, close, travelGroup:dbTravelGroup, proposal}:Props) {

    const travelGroup = useMemo(() => {
        return {
            ...dbTravelGroup,
            data: {
                ...dbTravelGroup.data,
                name: proposal.data.data.name || dbTravelGroup.data.name,
                desc: proposal.data.data.desc || dbTravelGroup.data.desc,
                destination: proposal.data.data.destination || dbTravelGroup.data.destination,
                date: proposal.data.data.date || dbTravelGroup.data.date,
                image: proposal.data.data.image || dbTravelGroup.data.image
            }
        }
    }, [])

    return (
        <Dialog fullScreen open={open} onClose={close}>
            <AppBar sx={{position: 'relative', bgcolor: 'orangeBg.light'}}>
                <Toolbar>
                    <IconButton edge="start" onClick={close}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Paper>
                        <Box p={3}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150},
                                        borderRadius: 2}}
                                        src={travelGroup.data.image?.src || '/default_travelgroup.png'}
                                        variant="square" />
                                    </Grid>
                                    <Grid item>
                                        <Box>
                                            <Box mb={2}>
                                                <Typography variant="h4">
                                                    {travelGroup.data.name}     
                                                </Typography>     
                                            </Box>
                                            <Box ml={2} mb={2}>
                                                <Grid container wrap="nowrap" alignItems="start">
                                                    <Grid item>
                                                        <LocationOnIcon sx={{mt: 0.5, color: 'secondary.main'}} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Box ml={1}>
                                                            {travelGroup.data.destination.address && <Typography variant="h6">
                                                                {travelGroup.data.destination.address},
                                                            </Typography>}
                                                            <Typography variant="h6">
                                                                {getGeneralDestination(travelGroup.data.destination)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Box ml={2}>
                                                <Typography variant="body1">
                                                    {travelGroup.data.desc}
                                                </Typography>
                                            </Box>
                                        </Box> 
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Dialog>
    )
}