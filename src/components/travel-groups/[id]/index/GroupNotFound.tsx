import { Box, Container, Paper, Typography } from "@mui/material";
import {useRouter} from 'next/router'
import { OrangePrimaryButton } from "../../../mui-customizations/buttons";
import Head from 'next/head'
import styles from '../../../../styles/pages/HeaderFooter.module.css'
import { ClientUser } from "../../../../database/interfaces";
import { UserNotifications } from "../../../hooks/userNotifications";
import NameOnlyHeader from '../../../nav/NameOnlyHeader'

export function FullGroupNotFound() {

    return (
        <>
            <Head>
                <title>Travel Group Not Found | Travel Simply</title>
            </Head>
            <div className={styles.root}>
                <NameOnlyHeader />
                <div>
                    <GroupNotFound />
                </div>
                <div>
                    footer
                </div>
            </div>
        </>
    )
}

export default function GroupNotFound() {

    const router = useRouter()

    return (
        <Box m={3}>
            <Container maxWidth="sm">
                <Paper>
                    <Box minHeight={400} display="flex" justifyContent="center" alignItems="center" px={3}>
                        <Box textAlign="center">
                            <Typography variant="h6" gutterBottom>
                                Hmm... we couldn't find this group. It may have been disbanded.
                            </Typography>
                            <OrangePrimaryButton sx={{minWidth: 200}} onClick={() => router.back()}>
                                Back
                            </OrangePrimaryButton>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}