import {Button, Grid, Typography, Box, SvgIcon, IconButton} from '@mui/material'
import {styled} from '@mui/material/styles'

export const OrangePrimaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: '#fff',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    }
}))

export const OrangeDensePrimaryButton = styled(Button)(({theme}) => ({
    background: theme.palette.primary.main,
    color: '#fff',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    transition: 'background 300ms',
    '&:hover': {
        background: theme.palette.primary.dark
    }
}))

export const OrangeSecondaryButton = styled(Button)(({theme}) => ({
    background: 'transparent',
    border: '1px solid #000',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    transition: 'background color border 300ms',
    color: '#000',
    '&:hover': {
        color: '#fff',
        background: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark
    }
}))

export const OrangePrimaryIconButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.primary.main,
    transition: 'color 300ms',
    '&:hover': {
        color: theme.palette.primary.dark
    }
}))

export const OrangeSecondaryIconButton = styled(IconButton)(({theme}) => ({
    transition: 'color 300ms',
    '&:hover': {
        color: theme.palette.primary.dark
    }
}))

interface GoogleSignInProps {
    onClick: () => void;
    isSignUp?: boolean;
}

export function GoogleSignIn({onClick, isSignUp}:GoogleSignInProps) {

    return (
        <OrangeSecondaryButton onClick={onClick} fullWidth>
            <Grid container spacing={3} alignItems="center" wrap="nowrap">
                <Grid item>
                    <Box height="100%" display="grid" alignItems="center" m={1}>
                        <img src="/google.svg" />
                    </Box>
                </Grid>
                <Grid item>
                    <Box>
                        <Typography variant="body1">
                            Sign {isSignUp ? 'up' : 'in'} with Google
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </OrangeSecondaryButton>
    )
}