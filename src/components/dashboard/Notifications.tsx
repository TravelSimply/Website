import { Box, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { getNotificationContents } from "../../utils/userNotifications";
import { UserNotifications } from "../hooks/userNotifications";
import { INotContent } from "../nav/Notifications";
import Link from 'next/link'
import { darkPrimaryOnHover } from "../misc/animations";
import BackpackIcon from '@mui/icons-material/Backpack'

interface Props {
    notifications: UserNotifications;
}

export default function Notifications({notifications}:Props) {

    const [notContent, setNotContent] = useState<INotContent[]>([])

    useMemo(() => {
        if (!notifications.filtered) return

        setNotContent(getNotificationContents(notifications))
    }, [notifications])

    return (
        <Box mt={3}>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {notContent.map((not, i) => (
                    <Grid item key={i} xs={12}>
                        <Link href={not.href} as={not.as}>
                            <a>
                                <Box borderRadius={10} px={3} width="100%"
                                bgcolor="orangeBg.light" sx={{...darkPrimaryOnHover}}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box pt={0.3}>
                                                {not.icon}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography variant="body1">
                                                {not.msg}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <BackpackIcon sx={{opacity: 0}} fontSize="large" />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography variant="body2" color="text.secondary">
                                                {not.time}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </a>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}