import { Avatar, Box, Container, Grid, Paper, Typography, IconButton, Badge } from '@mui/material';
import React from 'react'
import { ClientUser } from '../../../../database/interfaces';
import FullProfileForm, {Props as FullProfileFormProps} from '../../../forms/FullProfile'
import {FormikHelpers} from 'formik'
import CreateIcon from '@mui/icons-material/Create';
import {OrangePrimaryIconButton} from '../../../mui-customizations/buttons'
import { PrimaryLink } from '../../../misc/links';

interface Props {
    user: ClientUser;
}

export default function Main({user}:Props) {

    const onProfileFormSubmit = async (vals:FullProfileFormProps['vals'], actions:FormikHelpers<FullProfileFormProps['vals']>) => {

    }

    return (
        <Box mx={3} pt={2}>
            <Container maxWidth="lg">
                <Paper>
                    <Box p={2}>
                        <Container maxWidth="md">
                            <Grid container spacing={3} justifyContent="space-around">
                                <Grid item>
                                    <Box>
                                        <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={
                                            <Box borderRadius="50%" bgcolor="primary.main" >
                                                <IconButton sx={{color: '#fff'}}>
                                                    <CreateIcon />
                                                </IconButton>
                                            </Box>
                                            }>
                                                <Avatar sx={{width: {md: 200, sm: 150, xs: 150}, height: {md: 200, sm: 150, xs: 150}}}
                                                src={user.data.image?.src || '/default_profile.png'} 
                                                imgProps={{referrerPolicy: 'no-referrer'}} />
                                        </Badge>
                                    </Box>
                                    <Box mt={2} textAlign="center">
                                        <PrimaryLink href="/profile/friends">
                                            {user.data.friends?.length || 0} friends
                                        </PrimaryLink>
                                    </Box>
                                </Grid>
                                <Grid item sx={{minWidth: {xs: 300, sm: 400}}}>
                                    <Box>
                                        <FullProfileForm vals={{
                                            firstName: user.data.firstName || '',
                                            lastName: user.data.lastName || '',
                                            username: user.data.username || ''
                                        }} onSubmit={onProfileFormSubmit} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}