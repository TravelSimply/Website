import {Box, Grid, IconButton, Menu, MenuItem, Paper, Typography} from '@mui/material'
import { useMemo, useState, MouseEvent } from 'react';
import { ClientTravelGroup, ClientTravelGroupProposalWithByPopulated, ClientUser } from "../../../../database/interfaces";
import dayjs from 'dayjs'
import EditIcon from '@mui/icons-material/Edit';
import { OrangeDensePrimaryButton, OrangePrimaryIconButton } from '../../../mui-customizations/buttons';
import { findSentDiff } from '../../../../utils/dates';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios'
import Snackbar from '../../../misc/snackbars'

interface Props {
    isAdmin: boolean;
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    proposal: ClientTravelGroupProposalWithByPopulated;
    onAccepted: () => void;
    onRejected: () => void;
}

export default function ProposalCard({isAdmin, user, travelGroup, proposal, onAccepted, onRejected}:Props) {

    const [votesFor, setVotesFor] = useState(proposal.data.for)
    const [votesAgainst, setVotesAgainst] = useState(proposal.data.against)
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement>(null)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const onMoreClick = (e:MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const onMoreClose = () => {
        setAnchorEl(null)
    }

    const removeIdFromArr = (arr:string[]) => {
        const aCopy = [...arr]
        aCopy.splice(aCopy.indexOf(user.ref['@ref'].id), 1)
        return aCopy
    }

    useMemo(() => {
        if (votesFor.includes(user.ref['@ref'].id) && votesAgainst.includes(user.ref['@ref'].id)) {
            setVotesAgainst(removeIdFromArr(votesAgainst))
        }
    }, [votesFor])

    useMemo(() => {
        if (votesAgainst.includes(user.ref['@ref'].id) && votesFor.includes(user.ref['@ref'].id)) {
            setVotesFor(removeIdFromArr(votesFor))
        }
    }, [votesAgainst])

    const vote = useMemo(() => {
        if (votesFor.includes(user.ref['@ref'].id)) {
            return 'for'
        }
        if (votesAgainst.includes(user.ref['@ref'].id)) {
            return 'against'
        }
        return ''
    }, [votesFor, votesAgainst])

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
    }, []) 

    const diff = useMemo(() => {
        return findSentDiff(dayjs(proposal.data.timeSent['@ts']))
    }, [])

    const cancelVote = async (cancelling:string) => {

        if (cancelling === 'for') {
            setVotesFor(removeIdFromArr(votesFor))
        } else {
            setVotesAgainst(removeIdFromArr(votesAgainst))
        }
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals/vote`,
                data: {
                    cancel: cancelling,
                    proposalId: proposal.ref['@ref'].id
                }
            })

        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Removing Vote'})
        }
        
        setLoading(false)
    }

    const voteFor = async () => {
        if (vote === 'for') {
            return cancelVote('for')
        }

        setVotesFor([...votesFor, user.ref['@ref'].id])
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals/vote`,
                data: {
                    vote: 'for',
                    proposalId: proposal.ref['@ref'].id
                }
            })

        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Adding Vote'})
        }

        setLoading(false)
    }

    const voteAgainst = async () => {
        if (vote === 'against') {
            return cancelVote('against')
        }

        setVotesAgainst([...votesAgainst, user.ref['@ref'].id])
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals/vote`,
                data: {
                    vote: 'against',
                    proposalId: proposal.ref['@ref'].id
                }
            })

        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Adding Vote'})
        }

        setLoading(false)
    }

    const accept = async () => {

        setAnchorEl(null)
        setLoading(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/proposals/accept`, 
                data: {
                    proposalId: proposal.ref['@ref'].id,
                    proposalUserUsername: proposal.data.by.data.username || '',
                    data: proposal.data.data
                }
            })

            onAccepted()
        } catch (e) {
            setSnackbarMsg({type: 'error', content: 'Error Accepting Proposal'})
            setLoading(false)
        }
    }

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
                                                    <IconButton onClick={() => voteFor()} disabled={loading}>
                                                        <ArrowUpwardIcon
                                                        color={vote === 'for' ? 'primary' : 'inherit'} />
                                                        {votesFor.length}
                                                    </IconButton>
                                                </Grid>
                                                <Grid item mx={1} my={2}>
                                                    <IconButton onClick={() => voteAgainst()} disabled={loading}>
                                                        <ArrowDownwardIcon
                                                        color={vote === 'against' ? 'primary' : 'inherit'} />
                                                        {votesAgainst.length}
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item my={2} mr={2}>
                                            <OrangePrimaryIconButton disabled={loading} onClick={onMoreClick}>
                                                <MoreVertIcon />
                                            </OrangePrimaryIconButton>
                                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMoreClose}
                                            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                            transformOrigin={{horizontal: 'center', vertical: 'top'}}>
                                                <MenuItem onClick={() => accept()}>
                                                    Accept 
                                                </MenuItem>
                                                <MenuItem>
                                                    Reject 
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}