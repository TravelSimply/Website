import { Box, Grid } from "@mui/material";

export default function TitleBanner() {

    return (
        <Box height={700} sx={{
            backgroundImage: 'url(/home/sky.svg)',
            backgroundSize: 'auto 100%'
        }} >
            <Grid container height="100%" wrap="nowrap">
                <Grid item xs={0} xl={3} height="100%">
                    <Box height="100%" overflow="hidden">

                    </Box>
                </Grid>
                <Grid item xs={12} lg={7} xl={6} minWidth={800} height="100%">
                    <Box height="100%" position="relative" overflow="hidden">
                        <Box zIndex={2} position="absolute" left="80%" top="85%" width="21%" height="16%" sx={{
                            backgroundImage: 'url(/home/beach-transition.svg)',
                            backgroundSize: 'cover',
                            backgroundPosition: '0 100%',
                            backgroundRepeat: 'no-repeat',
                        }} />
                        <Box position="absolute" left="0" top="84%" width="81%" height="16.25%" sx={{
                            backgroundImage: 'url(/home/beach.svg)',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }} />
                        <Box zIndex={3} position="absolute" left="30%" width="70%" top="80%" height="15%" sx={{
                            backgroundImage: 'url(/home/soccer.svg)',
                            backgroundSize: 'auto 100%',
                            backgroundRepeat: 'no-repeat'
                        }} />
                        <Box zIndex={3} position="absolute" left="10%" width="20%" top="75%" height="15%" sx={{
                            backgroundImage: 'url(/home/umbrella.svg)',
                            backgroundSize: 'auto 100%',
                            backgroundRepeat: 'no-repeat',
                            transform: 'rotate(-10deg)'
                        }} />
                    </Box>
                </Grid>
                <Grid item xs={0} lg={5} height="100%">
                    <Box height="100%" overflow="hidden">
                        <Box height="100%" width="100%" sx={{
                            backgroundImage: 'url(/home/mountain.svg)',
                            backgroundSize: 'auto 70%',
                            backgroundPosition: '0 120%',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <Box height="100%" width="100%" sx={{
                                backgroundImage: 'url(/home/waves.svg)',
                                backgroundSize: 'auto 20%',
                                backgroundPosition: '0 100%',
                                backgroundRepeat: 'repeat-x',
                            }}>
                                <Box height="100%" width="100%" sx={{
                                    backgroundImage: 'url(/home/boat.svg)',
                                    backgroundSize: '40% 20%',
                                    backgroundPosition: '60% 90%',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}