import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { PrimarySearchBar } from "../../misc/searchBars";

export interface Filters {
    search?: string;
    startDate?: string;
    endDate?: string;
    lengthNum?: string;
    lengthScale?: string;
    dateType?: 'unknown' | 'roughly' | 'known';
    destinationRegion?: string;
    destinationCountry?: string;
    destinationState?: string;
    destinationCity?: string;
}

export default function Search() {

    const router = useRouter()

    const setSearch = (search:string) => {
        router.push({
            pathname: '/travel-groups/find',
            query: {...router.query, search}
        }, undefined, {shallow: true})
    }

    return (
        <Box>
            <PrimarySearchBar search={router.query.search?.toString() || ''} setSearch={setSearch} />  
        </Box>
    )
}