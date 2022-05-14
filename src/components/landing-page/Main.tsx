import { Box } from "@mui/material";
import TitleBanner from "./TitleBanner";
import FindGroups from './FindGroups'
import CoordinateTravelling from "./Coordinate";

export default function Main() {

    return (
        <Box>
            <Box>
                <TitleBanner />
            </Box>
            <Box mt={5}>
                <FindGroups />
            </Box>
            <Box mt={5}>
                <CoordinateTravelling />
            </Box>
        </Box>
    )
}