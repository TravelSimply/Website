import { Box } from "@mui/material";
import useSWR from "swr";
import { ClientTripWithTravelGroupBareInfo, ClientUser } from "../../../../../../database/interfaces";

interface Props {
    user: ClientUser;
    trip: ClientTripWithTravelGroupBareInfo;
}

export default function Main({user, trip}:Props) {

    const {data:travellers} = useSWR(
        `/api/travel-groups/${trip.data.travelGroup.id}/trips/${trip.ref['@ref'].id}/travellers`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    console.log(travellers)

    return (
        <Box>
            the great section
        </Box>
    )
}