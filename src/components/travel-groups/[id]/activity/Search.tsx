import { Dispatch, SetStateAction } from "react";
import {Box, Container, Grid } from '@mui/material'
import { PrimarySearchBar } from "../../../misc/searchBars";

interface Props {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    filters: boolean[];
    setFilters: Dispatch<SetStateAction<boolean>>;
}

export default function Search({search, setSearch, filters, setFilters}) {

    return (
        <Container maxWidth="sm">
            <Grid container spacing={1}>
                <Grid item flex={1}>
                    <PrimarySearchBar search={search} setSearch={setSearch} />
                </Grid>
                <Grid item>
                    dropdown
                </Grid>
            </Grid>
        </Container>
    )
}