import { Box } from "@mui/material";
import TitleBanner from "./TitleBanner";
import FindGroups from './FindGroups'

export default function Main() {

    return (
        <Box>
            <Box>
                <TitleBanner />
            </Box>
            <Box mt={3}>
                <FindGroups />
            </Box>
        </Box>
    )
}