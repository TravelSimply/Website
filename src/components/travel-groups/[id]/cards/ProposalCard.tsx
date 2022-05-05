import {Box, Grid, IconButton, Paper, Typography} from '@mui/material'
import { useMemo } from 'react';
import { ClientTravelGroup, ClientTravelGroupProposalWithByPopulated } from "../../../../database/interfaces";
import dayjs from 'dayjs'
import EditIcon from '@mui/icons-material/Edit';
import { OrangeDensePrimaryButton, OrangePrimaryIconButton } from '../../../mui-customizations/buttons';
import { findSentDiff } from '../../../../utils/dates';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
    isAdmin: boolean;
    travelGroup: ClientTravelGroup;
    proposal: ClientTravelGroupProposalWithByPopulated;
    onAccepted: () => void;
    onRejected: () => void;
}

export default function ProposalCard({isAdmin, travelGroup, proposal, onAccepted, onRejected}:Props) {

    const msg = useMemo(() => {
        if (proposal.data.data.date) {
            const {start, end} = proposal.data.data.date
            return `travel from ${dayjs(start).format('MM/DD/YY')} to ${dayjs(end).format('MM/DD/YY')}`
        }
        const {desc, destination, image, name} = proposal.data.data
        const changing:string[] = []
        if (desc) changing.push('description')
        if (destination) changing.push('destination')
        if (image) changing.push('image')
        if (name) changing.push('name')
        let changeList = ''
        if (changing.length === 1) {
            changeList = changing[0]
        } else {
            changing.forEach((change, i) => {
                if (i === changing.length - 1) {
                    changeList += change
                } else if (i === changing.length - 2) {
                    changeList += `${change}, and `
                } else {
                    changeList += `${change}, `
                }
            })
        }
        return `change the ${changeList}`
    }, [proposal]) 

    const diff = useMemo(() => {
        return findSentDiff(dayjs(proposal.data.timeSent['@ts']))
    }, [proposal])

    return (
        <Box maxWidth={400} height="100%">
            <Paper sx={{height: '100%'}}>
                <Grid container direction="column" height="100%" justifyContent="space-between">
                    <Grid item>
                        <Box p={2}>
                            <Box>
                                <Grid container wrap="nowrap" spacing={2} alignItems="center">
                                    <Grid item>
                                        <Box m={1} sx={{width: {xs: 50, sm: 100}, height: {xs: 50, sm: 100}}}
                                        borderRadius="50%" display="flex" justifyContent="center" alignItems="center"
                                        bgcolor="primary.light">
                                            <EditIcon sx={{fontSize: {xs: 50, sm: 50}, color: '#fff'}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <Typography gutterBottom variant="h6">
                                                Proposal to {msg}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box> 
                            <Box mb={2}>
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <Box m={1} sx={{width: {xs: 50, sm: 100}}} />
                                    </Grid>
                                    <Grid item>
                                        {!proposal.data.data.date && <OrangeDensePrimaryButton>
                                            Preview     
                                        </OrangeDensePrimaryButton>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Grid container height="100%" direction="column" justifyContent="space-between">
                            <Grid item>
                                <Box ml={1} mb={2}>
                                    <Typography variant="body1">
                                        Proposed by @{proposal.data.by.data.username} {diff} ago.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box bgcolor="orangeBg.light">
                                    <Grid container justifyContent="space-between">
                                        <Grid item flex={1}>
                                            <Grid container>
                                                <Grid item ml={2} mr={1} my={2}>
                                                    <IconButton>
                                                        <ArrowUpwardIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item mx={1} my={2}>
                                                    <IconButton>
                                                        <ArrowDownwardIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item my={2} mr={2}>
                                            <OrangePrimaryIconButton>
                                                <MoreVertIcon />
                                            </OrangePrimaryIconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}