import {createTheme} from '@mui/material/styles'

export default createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: 'hsl(30, 96%, 53%)' // orange
        },
        background: {
            default: 'hsl(30, 98%, 98%)', // white with slight tint of orange
            paper: '#fff' // white
        }
    },
    typography: {
        fontFamily: [
            'Bitter',
            'Roboto',
            'Arial'
        ].join(','),
    },
    
})