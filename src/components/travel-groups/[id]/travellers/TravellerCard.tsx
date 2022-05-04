import { Avatar, Box, Grid, IconButton, ListItemText, Menu, MenuItem, Paper, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState, MouseEvent } from "react";
import { ClientFilteredUser, ClientTravelGroup, ClientUser, ClientUserWithContactInfo } from "../../../../database/interfaces";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { OrangeDensePrimaryButton, OrangePrimaryButton, OrangePrimaryIconButton } from "../../../mui-customizations/buttons";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Snackbar from '../../../misc/snackbars'
import axios from "axios";

interface Props {
    user: ClientUser;
    isAdmin: boolean;
    traveller: ClientUserWithContactInfo;
    travellers: ClientUserWithContactInfo[];
    travelGroup: ClientTravelGroup;
    onTravellerRemoved?: (remaining:ClientUserWithContactInfo[]) => void;
}

function formatPhoneNumber(phone:string) {
    if (isNaN(parseInt(phone))) {
        return phone
    }
    if (phone.length !== 10) {
        return phone
    }
    return phone.split('').map((val, i) => {
        if (i === 0) {
            return `(${val}`
        }
        if (i === 2) {
            return `${val}) `
        }
        if (i === 5) {
            return `${val}-`
        }
        return val
    }).join('')
}

export default function TravellerCard({user, isAdmin, traveller, travellers, travelGroup, onTravellerRemoved}:Props) {

    const [anchorEl, setAnchorEl] = useState<HTMLElement>(null)
    const [loading, setLoading] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState({type: '', content: ''})

    const contactInfo = useMemo(() => {
        return traveller.data.contactInfo?.data.info
    }, [traveller])

    const copyToClipboard = (val:string) => {
        navigator.clipboard.writeText(val)
    }

    const travellerIsUser = useMemo(() => {
        return user.ref['@ref'].id === traveller.ref['@ref'].id
    }, [traveller])

    const theme = useTheme()

    const small = useMediaQuery(theme.breakpoints.down('sm'))

    const onMoreClick = (e:MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const onMoreClose = () => {
        setAnchorEl(null)
    }

    const remove = async () => {
        if (!onTravellerRemoved) {
            return
        }

        setAnchorEl(null)
        setLoading(true)

        try {

            const remainingTravellers = travellers.filter(t => t.ref['@ref'].id !== traveller.ref['@ref'].id)

            await axios({
                method: 'POST',
                url: `/api/travel-groups/${travelGroup.ref['@ref'].id}/travellers/update`,
                data: {
                    travellers: remainingTravellers.map(t => t.ref['@ref'].id)
                }
            })

            onTravellerRemoved(remainingTravellers)            
        } catch (e) {
            setLoading(false)
            setSnackbarMsg({type: 'error', content: 'Error Removing Traveller'})
        }
    }

    return (
        <Box maxWidth={600} height="100%">
            <Paper sx={{height: '100%'}}>
                <Grid container direction="column" height="100%" justifyContent="space-between">
                    <Grid item>
                        <Box p={2}>
                            <Box>
                                <Grid container wrap="nowrap" spacing={5}>
                                    <Grid item>
                                        <Box mb={3}>
                                            <Box display="flex" justifyContent="center">
                                                <Avatar sx={{width: {xs: 100, sm: 100}, height: {xs: 100, sm: 100}}}
                                                src={traveller.data.image?.src || '/default_profile.png'} imgProps={{
                                                    referrerPolicy: 'no-referrer',
                                                    loading: 'lazy'
                                                }} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            {!small && <Basic contactInfo={contactInfo} copy={copyToClipboard} />}
                                        </Box>
                                    </Grid>
                                    <Grid item flex={1}>
                                        <Box mb={3}>
                                            <Box sx={{height: {xs: 100, sm: 100}}}>
                                                <Box display="grid" height="100%" alignItems="center">
                                                    <Box>
                                                        <ListItemText primary={<Typography variant={small ? 'h6' : 'h4'}>
                                                            {traveller.data.firstName} {traveller.data.lastName}
                                                        </Typography>} secondary={<Typography variant={small ? 'body2' : 'h6'} 
                                                        color="text.secondary">
                                                            @{traveller.data.username}
                                                        </Typography>} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box>
                                            {contactInfo?.socials && !small && <Socials contactInfo={contactInfo}
                                            copy={copyToClipboard} />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                            {small && <Box>
                                <Box>
                                    <Basic contactInfo={contactInfo} copy={copyToClipboard} />
                                </Box>     
                                <Box mt={2}>
                                    <Socials contactInfo={contactInfo} copy={copyToClipboard} />
                                </Box>
                            </Box>}
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box height="100%" minHeight={72} px={2} py={2} bgcolor="orangeBg.light">
                            {!travellerIsUser &&
                            <Grid container height="100%" spacing={3} justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    {user.data.friends?.includes(traveller.ref['@ref'].id) &&
                                    <Box>
                                        <Typography color="primary.main" variant="h6">
                                            Friends
                                        </Typography>
                                    </Box>
                                    }
                                </Grid>
                                {isAdmin && <Grid item>
                                    <OrangePrimaryIconButton disabled={loading} onClick={onMoreClick}  >
                                        <MoreVertIcon/>                                        
                                    </OrangePrimaryIconButton> 
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMoreClose}
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} 
                                    transformOrigin={{horizontal: 'center', vertical: 'top'}}>
                                        <MenuItem onClick={() => remove()}>
                                            Remove 
                                        </MenuItem>
                                    </Menu>
                                </Grid>}
                            </Grid>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar msg={snackbarMsg} setMsg={setSnackbarMsg} />
        </Box>
    )
}

interface InfoProps {
    contactInfo:ClientUserWithContactInfo['data']['contactInfo']['data']['info']
    copy: (val:string) => void;
}

export function Socials({contactInfo, copy}:InfoProps) {

    if (!contactInfo) {
        return null
    }

    const socials = ['whatsapp', 'facebook', 'groupMe', 'discord']

    return (
        <Grid container direction="column" spacing={1}>
            {socials.map(social => contactInfo.socials[social] && 
            <Grid item xs={6} key={social}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <Tooltip arrow title="copy">
                                <IconButton onClick={() => copy(contactInfo.socials[social])}>
                                    <img loading="lazy" src={`/${social.toLowerCase()}.svg`}
                                    style={{width: 24, height: 24}} />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">
                                {contactInfo.socials[social]}
                            </Typography>
                        </Grid>
                    </Grid>
            </Grid>)}
        </Grid>
    )
}

export function Basic({contactInfo, copy}:InfoProps) {

    if (!contactInfo) {
        return null
    }

    return (
        <Grid container spacing={1} direction="column">
            {(contactInfo.phones?.home || contactInfo.phones?.mobile) &&
            <Grid item>
                <Grid container spacing={1} wrap="nowrap" alignItems="center">
                    <Grid item>
                        <Tooltip arrow title="Copy">
                            <OrangePrimaryIconButton 
                            onClick={() => copy(formatPhoneNumber(
                                contactInfo.phones?.mobile || contactInfo.phones?.home || ''
                            ))}>
                                <PhoneIcon /> 
                            </OrangePrimaryIconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        {contactInfo.phones?.home && <Box my={1}>
                            <Typography variant="body1">
                                {formatPhoneNumber(contactInfo.phones.home)}
                            </Typography>
                        </Box>}
                        {contactInfo.phones?.mobile && <Box my={1}>
                            <Typography variant="body1">
                                {formatPhoneNumber(contactInfo.phones.mobile)}
                            </Typography>
                        </Box>}
                    </Grid>
                </Grid>
            </Grid>}
            {contactInfo.email && <Grid item>
                <Grid container spacing={1} wrap="nowrap" alignItems="center">
                    <Grid item>
                        <Tooltip arrow title="Copy">
                            <OrangePrimaryIconButton 
                            onClick={() => copy(contactInfo.email)}>
                                <EmailIcon/>
                            </OrangePrimaryIconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            {contactInfo.email}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>}
        </Grid>
    )
}