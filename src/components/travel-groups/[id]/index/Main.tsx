import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getDestination as getGeneralDestination } from "../../index/TravelGroupCard";
import dayjs from "dayjs";
import Calendar from "../../../calendar/Calendar";
import { useMemo, useState } from "react";
import { OrangePrimaryButton, OrangePrimaryIconButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EditOverview from './EditOverview'
import ProposeDate from "./ProposeDate";
import ModifyDate from "./ModifyDate";
import Snackbar from '../../../misc/snackbars'
import Overview from "./Overview";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup:dbTravelGroup}:Props) {

    const [editing, setEditing] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const [travelGroup, setTravelGroup] = useState(dbTravelGroup)

    const [changeDate, setChangeDate] = useState<'' | 'propose' | 'modify'>('')

    const [start, end] = useMemo(() => {
        return [
            dayjs(travelGroup.data.date.start).format('MMMM D'),
            dayjs(travelGroup.data.date.end).format('MMMM D')
        ]
    }, [])

    const estLength = useMemo(() => {
        return `${travelGroup.data.date.estLength[0]} 
        ${travelGroup.data.date.estLength[1].substring(0, travelGroup.data.date.estLength[1].length - 1)}`
    }, [])

    const onEditComplete = (type:string, changes?) => {
        if (type === 'proposal') {
            setSnackbarMsg({type: 'success', content: 'Created Proposal'})
        } else if (changes) {
            setSnackbarMsg({type: 'success', content: 'Updated Information'})
            setTravelGroup({
                ...travelGroup,
                data: {
                    ...travelGroup.data,
                    ...changes
                } 
            })
        } 
        setEditing(false)
    }

    const onDateChangeComplete = (type:string, changes?) => {
        if (type === 'proposal') {
            setSnackbarMsg({type: 'success', content: 'Created Proposal'})
        } else if (changes) {
            setSnackbarMsg({type: 'success', content: 'Updated Information'})
            setTravelGroup({
                ...travelGroup,
                data: {
                    ...travelGroup.data,
                    ...changes
                }
            })
        }
        setChangeDate('')
    }

    return (
        <Box mt={3} mx={3}>
            <Container maxWidth="md">
                <Box mb={3}>
                    <Paper>
                        <Box position="relative" p={3}>
                            {editing ? <EditOverview travelGroup={travelGroup}
                            isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                            junkIds={user.data.junkImagePublicIds}
                            onEditComplete={onEditComplete} /> 
                            : <Overview travelGroup={travelGroup} />}
                            <Box position="absolute" top="0px" right="0px">
                                <OrangePrimaryIconButton onClick={() => setEditing(!editing)}>
                                    {editing ? <CancelIcon sx={{fontSize: 30}} /> :
                                    <EditIcon sx={{fontSize: 30}} /> }
                                </OrangePrimaryIconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box>
                    <Paper>
                        <Box p={3}>
                            {changeDate !== 'modify' && <Box textAlign="center" mb={2}>
                                <Typography variant="h6">
                                    {travelGroup.data.date.unknown ? 
                                    `${estLength} trip.` : 
                                    travelGroup.data.date.roughly ?
                                    `${estLength} trip sometime between ${start} and ${end}.` :
                                    `Traveling from ${start} to ${end}.`
                                    }
                                </Typography>
                            </Box>}
                            {changeDate === '' ? <>
                                {!travelGroup.data.date.unknown && <Box mb={2}>
                                    <Calendar dateRange={[dayjs(travelGroup.data.date.start), dayjs(travelGroup.data.date.end)]}
                                    onDateRangeChange={(a) => {}} availability={{ref: {'@ref': {id: '1', ref: null}}, data: {userId: '1', dates: {}}}}
                                    displayOnly startDate={dayjs(travelGroup.data.date.start)} />
                                </Box>}
                                <Box mb={2}>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item>
                                            {(travelGroup.data.date.unknown || travelGroup.data.date.roughly) && <OrangePrimaryButton
                                            onClick={() => setChangeDate('propose')}>
                                                Propose a Travel Date     
                                            </OrangePrimaryButton>}
                                        </Grid>
                                        <Grid item>
                                            {travelGroup.data.owner === user.ref['@ref'].id && <OrangeSecondaryButton
                                            onClick={() => setChangeDate('modify')}>
                                                Modify Travel Date Settings     
                                            </OrangeSecondaryButton>}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </> : changeDate === 'propose' ? 
                            <Box>
                                <ProposeDate travelGroup={travelGroup}
                                onDateChangeComplete={onDateChangeComplete} />
                            </Box> : 
                            <Box>
                                <ModifyDate travelGroup={travelGroup} onDateChangeComplete={onDateChangeComplete} /> 
                            </Box>}
                        </Box>
                    </Paper>
                </Box>
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}