import {Button, Grid, Typography, Box, SvgIcon} from '@mui/material'
import {styled} from '@mui/material/styles'

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

interface GoogleSignInProps {
    onClick: () => void;
}

export function GoogleSignIn({onClick}:GoogleSignInProps) {

    return (
        <OrangeSecondaryButton onClick={onClick} fullWidth>
            <Grid container spacing={3} alignItems="center" wrap="nowrap">
                <Grid item>
                    <Box height="100%" display="grid" alignItems="center" m={1}>
                        <img src="/google.svg" />
                    </Box>
                </Grid>
                <Grid item>
                    <Box textAlign="center">
                        <Typography variant="body1">
                            Sign in with Google
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </OrangeSecondaryButton>
    )
}