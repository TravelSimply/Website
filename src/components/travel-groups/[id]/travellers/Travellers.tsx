import {useState, useMemo, useCallback} from 'react'
import { ClientTravelGroup, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import {Box, Grid} from '@mui/material'
import TravellerCard from './TravellerCard'
import {mutate} from 'swr'
import { searchForUsers } from '../../../../utils/search';

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
    travellers: ClientUserWithContactInfo[];
    search: string;
}

export default function Travellers({user, travelGroup, travellers, search}:Props) {

    const [searchedTravellers, setSearchedTravellers] = useState(travellers || [])

    useMemo(() => {
        if (!travellers) {
            return
        }
        setSearchedTravellers(travellers)
    }, [travellers])

    useMemo(() => {

        if (!travellers) {
            return
        }

        if (!search.trim()) {
            setSearchedTravellers(travellers)
        }

        setSearchedTravellers(searchForUsers(search, travellers) as ClientUserWithContactInfo[])
    }, [search])

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedTravellers.map((member, i) => (
                    <Grid item key={i} flexBasis={600} sx={{mb: 3, mx: 1}}>
                        <TravellerCard user={user} isAdmin={travelGroup.data.owner === user.ref['@ref'].id}
                        traveller={member} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}