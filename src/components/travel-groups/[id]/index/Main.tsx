import { Avatar, Box, Container, Grid, Paper, Typography } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from "dayjs";
import Calendar from "../../../calendar/Calendar";
import { useMemo, useState } from "react";
import { OrangePrimaryButton, OrangePrimaryIconButton, OrangeSecondaryButton } from "../../../mui-customizations/buttons";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EditOverview from './EditOverview'
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
            </Container>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}