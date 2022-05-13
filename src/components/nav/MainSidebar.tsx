import { Box, Breakpoint, useMediaQuery, useTheme, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { DrawerItem } from './MainHeader';
import Link from 'next/link'
import { primaryLightBgOnHover } from '../misc/animations';

interface Props {
    breakpoint: Breakpoint;
    items: DrawerItem[];
}

export default function MainSidebar({breakpoint, items}:Props) {

    const theme = useTheme()
    const display = useMediaQuery(theme.breakpoints.up(breakpoint))

    if (!display) {
        return (
            null
        )
    }

    return (
        <Box height="100%" bgcolor="orangeBg.light" borderRight="1px solid rgba(0,0,0,0.34)"
        minWidth={200}>
            <Box mt={1}>
                <List>
                    {items.map((item, i) => (
                        <Link key={i} href={item.href} as={item.as}>
                            <a>
                                <ListItemButton sx={{backgroundColor: item.selected ? 'primary.light' : undefined, 
                                    color: item.selected ? '#fff' : undefined,
                                    ...primaryLightBgOnHover}}>
                                    <ListItemText>
                                        <Typography variant="body1" sx={{mr: 1}} >
                                            {item.name}
                                        </Typography>
                                    </ListItemText>
                                </ListItemButton>
                            </a>
                        </Link>
                    ))}
                </List>
            </Box>
        </Box>
    )
}