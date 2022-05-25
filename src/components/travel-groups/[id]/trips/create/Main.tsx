import { Box } from "@mui/material";
import { ClientTravelGroup, ClientUser } from "../../../../../database/interfaces";

interface Props {
    user: ClientUser;
    travelGroup: ClientTravelGroup;
}

export default function Main({user, travelGroup}:Props) {

    return (
        <Box>
            main section comp
        </Box>
    )
}