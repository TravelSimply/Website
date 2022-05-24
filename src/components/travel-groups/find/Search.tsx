import { Autocomplete, Box, Checkbox, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { PrimarySearchBar } from "../../misc/searchBars";

export interface Filters {
    search?: string;
}

export default function Search() {

    const router = useRouter()

    const setSearch = (search:string) => {
        router.push({
            pathname: '/travel-groups/find',
            query: {...router.query, search: search.toLowerCase()}
        }, undefined, {shallow: true})
    }

    return (
        <Box position="relative">
            <Container maxWidth="sm">
                <Grid container spacing={1} alignItems="center">
                    <Grid item flex={1}>
                        <PrimarySearchBar search={router.query.search?.toString() || ''} setSearch={setSearch} />  
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
