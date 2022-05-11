import { Box, Container } from "@mui/material";
import useSWR from "swr";
import { ClientUser } from "../../../database/interfaces";

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const {data:bareGroupInfo} = useSWR(
        `/api/users/${user.ref['@ref'].id}/friends/travel-groups/bare-info`,
        {revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 3600000}
    )

    console.log('bareGroupInfo', bareGroupInfo)

    return (
        <Box mt={3}>
            <Container maxWidth="md">
                main stuf
            </Container>
        </Box>
    )
}