import React from 'react'
import Link from 'next/link'
import {Box, Typography} from '@mui/material'

export default function Header() {

    return (
        <Box my={3} textAlign="center">
            <Link href="/">
                <a>
                    <Typography color="primary.main"  variant="h2">
                        Travel Simply
                    </Typography>
                </a>
            </Link>
        </Box>
    )
}