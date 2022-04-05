import { Box } from "@mui/material";
import { ClientUser } from "../../../database/interfaces";

interface Props {
    user: ClientUser;
    travelDates: {start:{'@ts':string};end:{'@ts':string}}[];
}

export default function Main({user, travelDates}:Props) {

    return (
        <Box>
            main section
        </Box>
    )
}