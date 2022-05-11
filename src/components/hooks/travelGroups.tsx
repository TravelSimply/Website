import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ClientBareTravelGroupInfo, ClientTravelGroup } from "../../database/interfaces";

export function useSearchedTravelGroups(bareInfo:ClientBareTravelGroupInfo[]) {

    const [loading, setLoading] = useState(false)
    const [travelGroupBank, setTravelGroupBank] = useState<ClientTravelGroup[]>([])
    const [filteredTravelGroups, setFilteredTravelGroups] = useState<ClientTravelGroup[]>([])

    const {query} = useRouter()

    useMemo(() => {
        if (!bareInfo) return
        if (loading) return

        console.log('bareinfo', bareInfo)
        console.log('query change', query)
    }, [query, bareInfo])

    return loading ? undefined : filteredTravelGroups 
}