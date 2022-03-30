import Link from 'next/link'
import {Typography} from '@mui/material'
import React from 'react'

interface LinkProps {
    href: string;
    as?: string;
    children: React.ReactNode;
    variant?: "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline" | "inherit";
}

export function PrimaryLink({children, href, as, ...typographyProps}:LinkProps) {

    return (
        <Link href={href} as={as}>
            <a>
                <Typography sx={{
                    transition: 'color 100ms',
                    '&:hover': {
                        color: 'primary.dark'
                    }
                }} display="inline" {...typographyProps} color="primary.main">
                    {children}
                </Typography>
            </a>
        </Link>
    )
}