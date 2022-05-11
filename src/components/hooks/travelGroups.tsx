import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ClientBareTravelGroupInfo, ClientTravelGroup } from "../../database/interfaces";
import { Filters } from "../travel-groups/find/Search";

const MAX_FIND = 2

interface SearchGroupData {
    items: {
        match: boolean;
        travelGroup: ClientTravelGroup;
    }[];
    count: number;
}

function passesSearch(travelGroup:ClientTravelGroup, search:string) {
    if (!search) return true

    return travelGroup.data.name.toLowerCase().includes(search) || travelGroup.data.destination.combo.includes(search)
}

function passesFilters(travelGroup:ClientTravelGroup, filters:Filters) {

    return passesSearch(travelGroup, filters.search)
}

export function useSearchedTravelGroups(bareInfo:ClientBareTravelGroupInfo[]) {

    const [loading, setLoading] = useState(false)
    const [skipList, setSkipList] = useState<string[]>([])
    const [travelGroupBank, setTravelGroupBank] = useState<ClientTravelGroup[]>([])
    const [filteredTravelGroups, setFilteredTravelGroups] = useState<0 | ClientTravelGroup[]>([])

    const {query} = useRouter()

    useMemo(() => bareInfo && setSkipList(bareInfo.map(info => info[info.length - 1] as string)), [bareInfo])

    useMemo(() => {
        if (travelGroupBank.length > 0) setTravelGroupBank([])
    }, [bareInfo])

    const findMoreGroups = async (matches:ClientTravelGroup[], numToFind:number) => {

        try {

            console.log('skipList', skipList)

            const {data}:{data:SearchGroupData} = await axios({
                method: 'POST',
                url: `/api/users/friends/travel-groups/search`,
                data: {
                    travelGroupIds: skipList,
                    filters: query,
                    maxFinds: numToFind
                }
            })

            console.log('data', data)

            const copy = [...skipList]
            for (const group of data.items) {
                const i = copy.indexOf(group.travelGroup.ref['@ref'].id)
                copy.splice(i, 1)
            }
            setSkipList(copy)
            setTravelGroupBank([...travelGroupBank, ...data.items.map(item => item.travelGroup)])
            setFilteredTravelGroups([...matches, ...data.items.filter(item => item.match).map(item => item.travelGroup)])

        } catch (e) {
            setFilteredTravelGroups(0)
        }

        setLoading(false)
    }

    useEffect(() => {
        if (!bareInfo) return
        if (loading) return

        setLoading(true)

        const matchingTravelGroups = travelGroupBank.filter(group => passesFilters(group, query))

        const numToFind = MAX_FIND - matchingTravelGroups.length

        if (numToFind <= 0) {
            setFilteredTravelGroups(matchingTravelGroups)
            setLoading(false)
            return
        }

        findMoreGroups(matchingTravelGroups, numToFind)

    }, [query, bareInfo])

    return loading ? undefined : filteredTravelGroups 
}