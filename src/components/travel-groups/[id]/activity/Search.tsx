import {useState} from 'react'
import { Dispatch, SetStateAction } from "react";
import {Box, Container, Grid, Paper, Checkbox, Typography } from '@mui/material'
import { PrimarySearchBar } from "../../../misc/searchBars";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton, OrangePrimaryIconButton } from "../../../mui-customizations/buttons";

interface Props {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    filters: boolean[];
    setFilters: Dispatch<SetStateAction<boolean>>;
}

export default function Search({search, setSearch, filters, setFilters}) {

    const [viewFilters, setViewFilters] = useState(false)

    const [dropDownFilters, setDropDownFilters] = useState(filters)

    const toggleCheck = (i:number) => {
        const copy = [...dropDownFilters]
        copy[i] = !copy[i]
        setDropDownFilters(copy)
    }

    const cancel = () => {
        setViewFilters(false)
        setDropDownFilters(filters)
    }

    const saveFilters = () => {
        setViewFilters(false)
        setFilters(dropDownFilters)
    }

    return (
        <Container sx={{position: 'relative'}} maxWidth="sm">
            <Grid container spacing={1} alignItems="center">
                <Grid item flex={1}>
                    <PrimarySearchBar search={search} setSearch={setSearch} />
                </Grid>
                <Grid item>
                    <OrangePrimaryIconButton onClick={() => setViewFilters(!viewFilters)}>
                        <ArrowDropDownIcon fontSize="large" />
                    </OrangePrimaryIconButton>
                </Grid>
            </Grid>
            {viewFilters && <Box position="absolute" left={0} top={70} px={3} width="100%" zIndex={1}>
                <Paper>
                    <Box p={2}>
                        {dropDownFilters.map((checked, i) => (
                            <Box key={i}>
                                <Grid container wrap="nowrap" alignItems="center">
                                    <Grid item>
                                        <Checkbox checked={checked} onClick={() => toggleCheck(i)}
                                        id={`toggle-${i}`} />
                                    </Grid>
                                    <Grid item>
                                        <label htmlFor={`toggle-${i}`}>
                                            <Typography variant="h6">
                                                {i === 0 ? 'Invitations' : 
                                                i === 1 ? 'Join Requests' : 
                                                i === 2 ? 'Proposals' :
                                                'Updates'}
                                            </Typography>
                                        </label>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        <Box mt={3}>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <OrangeDensePrimaryButton sx={{minWidth: 100}}
                                    onClick={() => saveFilters()}>
                                        Save
                                    </OrangeDensePrimaryButton>
                                </Grid>
                                <Grid item>
                                    <OrangeDenseSecondaryButton sx={{minWidth: 100}}
                                    onClick={() => cancel()}>
                                        Cancel
                                    </OrangeDenseSecondaryButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Box>}
        </Container>
    )
}