import {Box, Grid, Paper, Typography} from '@mui/material'
import { useMemo } from 'react';
import { ClientTravelGroup, ClientTravelGroupProposalWithByPopulated } from "../../../../database/interfaces";
import dayjs from 'dayjs'
import EditIcon from '@mui/icons-material/Edit';
import { OrangeDensePrimaryButton } from '../../../mui-customizations/buttons';
import { findSentDiff } from '../../../../utils/dates';

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
                                        <Box m={1}>
                                            <EditIcon color="primary" sx={{fontSize: {xs: 50, sm: 50}}} />
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Box mx={1}>
                                            <Typography gutterBottom variant="h6">
                                                Proposal to {msg}
                                            </Typography>
                                            {!proposal.data.data.date && <OrangeDensePrimaryButton>
                                                Preview
                                            </OrangeDensePrimaryButton>}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box> 
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box p={2} height="100%">
                            <Box ml={1} mt={1}>
                                <Typography variant="body1">
                                    Proposed by @{proposal.data.by.data.username} {diff}
                                </Typography>
                            </Box>
                            <Box bgcolor="orangeBg.light">
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}