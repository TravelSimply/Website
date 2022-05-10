import { ClientTravelGroup, ClientTravelGroupProposalWithByPopulated } from "../../../../database/interfaces";
import {useMemo} from 'react'
import { Container, Dialog, Box, Paper, Grid, Avatar, Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close'
import {getDestination as getGeneralDestination} from '../../index/TravelGroupCard'
import Overview from "../index/Overview";

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
                date: {...(proposal.data.data.date || dbTravelGroup.data.date), roughly: false, unknown: false,
                    estLength: [0, 'days']},
                image: proposal.data.data.image || dbTravelGroup.data.image
            }
        } as ClientTravelGroup
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
                            <Overview travelGroup={travelGroup} />
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Dialog>
    )
}