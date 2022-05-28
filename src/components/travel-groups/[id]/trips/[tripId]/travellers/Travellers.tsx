import {useState, useMemo, useCallback} from 'react'
import { ClientTravelGroup, ClientTrip, ClientTripWithTravelGroupBareInfo, ClientUser, ClientUserWithContactInfo } from "../../../../../../database/interfaces";
import {Box, Grid} from '@mui/material'
import {TravelGroupTravellerCard, TripTravellerCard} from '../../../cards/TravellerCard'
import {mutate} from 'swr'
import { searchForUsers } from '../../../../../../utils/search';
import Snackbar from '../../../../../misc/snackbars'

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
    travellers: ClientUserWithContactInfo[];
    search: string;
}

export default function Travellers({user, trip, travellers, search}:Props) {

    const [searchedTravellers, setSearchedTravellers] = useState(travellers || [])
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

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

    const onTravellerRemoved = (remaining:ClientUserWithContactInfo[]) => {
        setSnackbarMsg({type: 'success', content: 'Removed Traveller'})
        mutate(`/api/travel-groups/${trip.data.travelGroup.id}/trips/${trip.ref['@ref'].id}/travellers`, remaining, false)
    }

    return (
        <Box>
            <Grid container alignItems="stretch" justifyContent="space-around">
                {searchedTravellers.map((member, i) => (
                    <Grid item key={i} flexBasis={600} sx={{mb: 3, mx: 1}}>
                        <TripTravellerCard user={user} isAdmin={trip.data.leader === user.ref['@ref'].id}
                        traveller={member} travellers={travellers} trip={trip} 
                        onTravellerRemoved={onTravellerRemoved} />
                    </Grid>
                ))}
            </Grid>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}