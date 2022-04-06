import {createTheme} from '@mui/material/styles'
import {} from '@mui/material/styles/'
import { string } from 'yup'

declare module '@mui/material/styles' {
    interface Palette {
        orangeBg: {
            light: string;
        };
    }

    interface PaletteOptions {
        orangeBg?: {
            light?: string;
        }
    }
}

export default createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: 'hsl(30, 96%, 62.4%)',
            main: 'hsl(30, 96%, 53%)', // orange,
            dark: 'hsl(30, 96%, 45%)'
        },
        secondary: {
            main: 'hsl(209, 93%, 62%)'
        },
        info: {
            main: 'hsl(209, 93%, 42%)'
        }, 
        background: {
            default: 'hsl(30, 98%, 98%)', // white with slight tint of orange
            paper: '#fff', // white
        },
        orangeBg: {
            light: 'hsl(30, 98%, 95%)'
        },
        text: {
            primary: '#000'
        },
        error: {
            main: 'hsl(5, 95%, 50%)'
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