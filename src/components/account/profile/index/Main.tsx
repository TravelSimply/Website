import {Box, Container} from '@mui/material';
import {useState} from 'react'
import { ClientContactInfo, ClientPopulatedAvailability, ClientUser } from '../../../../database/interfaces';
import Snackbar from '../../../misc/snackbars'
import Profile from './Profile';
import Availability from './Availability';
import ContactInfo from './ContactInfo';
import Advanced from './Advanced';

interface Props {
    user: ClientUser;
    availability: ClientPopulatedAvailability;
    contactInfo: ClientContactInfo;
    notificationsId?: string;
}

export default function Main({user, availability, contactInfo, notificationsId}:Props) {

    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    return (
        <Box mx={3} pt={2}>
            <Box>
                <Container maxWidth="lg">
                    <Profile user={user} setSnackbarMsg={setSnackbarMsg} />
                </Container>
            </Box>
            <Box mt={3}>
                <Container maxWidth="lg">
                    <Availability availability={availability} />
                </Container>
            </Box>
            <Box mt={3}>
                <Container maxWidth="lg">
                    <ContactInfo contactInfo={contactInfo} setSnackbarMsg={setSnackbarMsg} />
                </Container>
            </Box>
            <Box my={3}>
                <Container maxWidth="lg">
                    <Advanced user={user} setSnackbarMsg={setSnackbarMsg} notificationsId={notificationsId} />
                </Container>
            </Box>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}