
export const darkPrimaryOnHover = {
    transition: 'color 100ms',
    '&:hover': {
        color: 'primary.dark',
        cursor: 'pointer'
    }
}

export const primaryLightBgOnHover = {
    transition: 'color backgroundColor 100ms',
    '&:hover': {
        color: '#fff',
        backgroundColor: 'primary.light'
    }
}

export const enlargeOnHover = {
    transition: 'transform 300ms',
    '&:hover': {
        transform: 'scale(1.05)'
    }
}