import { Autocomplete, Box, Checkbox, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { PrimarySearchBar } from "../../misc/searchBars";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { OrangeDensePrimaryButton, OrangeDenseSecondaryButton, OrangePrimaryIconButton } from "../../mui-customizations/buttons";
import { useMemo, useState } from "react";
import { getCountries, getCountry, getStates } from "country-state-picker";
import dayjs from 'dayjs'

export interface Filters {
    search?: string;
    startDate?: string;
    endDate?: string;
    lengthNum?: string;
    lengthScale?: 'days' | 'weeks' | 'months';
    lengthDays?: string;
    lengthType?: 'at-most' | 'at-least' | 'exactly';
    dateUnknown?: string;
    dateRougly?: string;
    dateKnown?: string;
    dateSearchType?: 'from' | 'between';
    destinationRegion?: string;
    destinationCountry?: string;
    destinationState?: string;
    destinationCity?: string;
}

const possibleRegions = ['Interregional', 'U.S. & Canada', 'Central America', 'South America', 'Europe', 
    'Asia', 'Africa', 'Oceania', 'Antarctica'].sort()

export default function Search() {

    const router = useRouter()

    const [viewFilters, setViewFilters] = useState(false)

    const setSearch = (search:string) => {
        router.push({
            pathname: '/travel-groups/find',
            query: {...router.query, search: search.toLowerCase()}
        }, undefined, {shallow: true})
    }

    const cancel = () => {
        setViewFilters(false)
    }

    const updateFilters = (update:Filters) => {
        router.push({
            pathname: '/travel-groups/find',
            query: {...router.query, ...update}
        }, undefined, {shallow: true})
        setViewFilters(false)
    }

    return (
        <Box position="relative">
            <Container maxWidth="sm">
                <Grid container spacing={1} alignItems="center">
                    <Grid item flex={1}>
                        <PrimarySearchBar search={router.query.search?.toString() || ''} setSearch={setSearch} />  
                    </Grid>
                    <Grid item>
                        <OrangePrimaryIconButton onClick={() => setViewFilters(!viewFilters)}>
                            <ArrowDropDown fontSize="large" />
                        </OrangePrimaryIconButton>
                    </Grid>
                </Grid>
            </Container>
            {viewFilters && <DropDown cancel={cancel} updateFilters={updateFilters} initialFilters={router.query} />}
        </Box>
    )
}

interface DropDownProps {
    cancel: () => void;
    updateFilters: (filters:Filters) => void;
    initialFilters: Filters;
}

function DropDown({cancel, updateFilters, initialFilters}:DropDownProps) {

    const [filters, setFilters] = useState(initialFilters)

    const [countryCode, setCountryCode] = useState('')

    const states = useMemo(() => getStates(countryCode) || getStates(getCountry(filters.destinationCountry || '')?.code) || [], [countryCode])

    const changeDateDays = (num:number, mag:string) => {
        if (!num) return
        if (num < 1) return
        let totalDays = 0
        if (!mag || mag === 'days') {
            totalDays = num
        } else if (mag === 'weeks') {
            totalDays = num * 7
        } else if (mag === 'months') {
            totalDays = num * 30
        }
        setFilters({...filters, lengthNum: num.toString(), lengthDays: totalDays.toString()})
    }

    const changeDateFlexibility = (flex:string) => {
        if (flex === 'unknown') {
            setFilters({...filters, dateUnknown: filters.dateUnknown ? '' : 'true', dateKnown: '', dateRougly: ''})
        } else if (flex === 'roughly') {
            setFilters({...filters, dateUnknown: '', dateRougly: filters.dateRougly ? '': 'true'})
        } else {
            setFilters({...filters, dateUnknown: '', dateKnown: filters.dateKnown ? '' : 'true'})
        }
    }

    useMemo(() => {
        if (!filters.dateKnown && !filters.dateRougly && !filters.dateUnknown) {
            setFilters({...filters, dateKnown: 'true', dateRougly: 'true'})
        }
    }, [filters])

    const countries = useMemo(() => getCountries(), [])

    return (
        <Box position="absolute" left={0} top={70} width="100%" zIndex={1}>
            <Paper>
                <Box p={2}>
                    <Box>
                        <Box mb={1}>
                            <Typography variant="body1" color="text.secondary">
                                Date
                            </Typography>
                        </Box>
                        <Box mb={3}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Select value={filters.dateSearchType || 'between'}
                                    onChange={(e) => setFilters({...filters, dateSearchType: e.target.value as any})}>
                                        <MenuItem value="from">From</MenuItem>
                                        <MenuItem value="between">Between</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <TextField type="date" InputLabelProps={{shrink: true}}
                                    label="Start" value={filters.startDate} 
                                    onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {filters.dateSearchType === 'from' ? 'to' : 'and'}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <TextField type="date" InputLabelProps={{shrink: true}}
                                    label="End" value={filters.endDate} 
                                    onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mb={3}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Select value={filters.lengthType || 'exactly'}
                                    onChange={(e) => setFilters({...filters, lengthType: e.target.value as any})}>
                                        <MenuItem value="exactly">Exactly</MenuItem>
                                        <MenuItem value="at-least">At Least</MenuItem>
                                        <MenuItem value="at-most">At Most</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <Box maxWidth={90}>
                                        <TextField type="number" value={filters.lengthNum || ''} 
                                        onChange={(e) => changeDateDays(parseInt(e.target.value), filters.lengthScale)} />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Select value={filters.lengthScale || 'days'} 
                                    onChange={(e) => changeDateDays(parseInt(filters.lengthNum), e.target.value)}>
                                        <MenuItem value="days">Days</MenuItem>
                                        <MenuItem value="weeks">Weeks</MenuItem>
                                        <MenuItem value="months">Months</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mb={3}>
                            <Grid container spacing={3} alignItems="center" wrap="nowrap">
                                <Grid item>
                                    <Typography variant="body1" color="text.secondary">
                                        Date Flexibility
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <Checkbox checked={Boolean(filters.dateUnknown)}
                                                    onClick={() => changeDateFlexibility('unknown')} id="toggle-unknown" />
                                                </Grid>
                                                <Grid item>
                                                    <label htmlFor="toggle-unknown">
                                                        <Typography variant="body1">
                                                            Unknown
                                                        </Typography>
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <Checkbox checked={Boolean(filters.dateRougly)}
                                                    onClick={() => changeDateFlexibility('roughly')} id="toggle-roughly" />
                                                </Grid>
                                                <Grid item>
                                                    <label htmlFor="toggle-roughly">
                                                        <Typography variant="body1">
                                                            Roughly
                                                        </Typography>
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container wrap="nowrap" alignItems="center">
                                                <Grid item>
                                                    <Checkbox checked={Boolean(filters.dateKnown)}
                                                    onClick={() => changeDateFlexibility('known')} id="toggle-known" />
                                                </Grid>
                                                <Grid item>
                                                    <label htmlFor="toggle-known">
                                                        <Typography variant="body1">
                                                            Known
                                                        </Typography>
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box>
                        <Box mb={2}>
                            <Typography variant="body1" color="text.secondary">
                                Destination
                            </Typography>
                        </Box>
                        <Box mb={3} maxWidth="sm">
                            <FormControl fullWidth>
                                <InputLabel>Region</InputLabel>
                                <Select label="Region" value={filters.destinationRegion || 'interregional'}
                                onChange={(e) => setFilters({...filters, destinationRegion: e.target.value})}>
                                    {possibleRegions.map(region => (
                                        <MenuItem key={region} value={region.toLowerCase()}>{region}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {filters.destinationRegion && filters.destinationRegion !== 'interregional' && <Box mb={3} maxWidth="sm">
                            <Autocomplete value={filters.destinationCountry || ''} renderInput={(params) => (
                                <TextField {...params} label="Country" />
                            )} options={[...countries, '']} getOptionLabel={(option:any) => option.name || option}
                            onChange={(e, value) => {
                                setFilters({...filters, destinationCountry: value?.name || '', 
                                    destinationCity: '', destinationState: ''})
                                setCountryCode(value?.code || '')
                            }}
                            isOptionEqualToValue={(option, value) => option?.name === value || option === value} />
                        </Box>}
                        {filters.destinationCountry && <Box mb={3} maxWidth="sm">
                            <Autocomplete value={filters.destinationState || ''} renderInput={(params) => (
                                <TextField {...params} label="State/Province" />
                            )} options={[...states, '']} onChange={(e, value) => setFilters({...filters, destinationState: value})} />
                        </Box>}
                        {filters.destinationCountry && <Box mb={3} maxWidth="sm">
                            <TextField value={filters.destinationCity} label="City" fullWidth
                            onChange={(e) => setFilters({...filters, destinationCity: e.target.value})} />
                        </Box>}
                    </Box>
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item>
                                <OrangeDensePrimaryButton sx={{minWidth: 100}}
                                onClick={() => updateFilters(filters)}>
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
        </Box>
    )
}