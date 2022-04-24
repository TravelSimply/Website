import {useMemo, useState} from 'react'
import { Container, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { ClientTravelGroup, ClientUser } from "../../../../database/interfaces";
import UserAdder from '../../../account/profile/UserAdder';

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function SendInvite({user, travelGroup}:Props) {

    if (travelGroup.data.settings.invitePriveleges === 'ownerOnly' && 
        user.ref['@ref'].id !== travelGroup.data.owner) {
        return null
    }

    const [addedTravellers, setAddedTravellers] = useState<ClientUser[]>([])
    const [startingAddList, setStartingAddList] = useState<ClientUser[]>([])

    useMemo(() => {

        console.log('filters')

    }, [addedTravellers])

    return (
        <Box>
            <Container maxWidth="sm">
                <Box>
                    <Paper>
                        <Box p={2}>
                            <UserAdder startingAddList={startingAddList} setAddedUsers={setAddedTravellers} />
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
}