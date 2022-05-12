import axios from "axios";
import dayjs from "dayjs";
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

function passesDateRange(travelGroup:ClientTravelGroup, queryStart:string, queryEnd:string, queryType:string) {
    const type = queryType ? queryType : 'between'
    const start = dayjs(queryStart)
    const end = dayjs(queryEnd)
    if (!start.isValid() || !end.isValid()) {
        return true
    }
    const groupStart = dayjs(travelGroup.data.date.start)
    const groupEnd = dayjs(travelGroup.data.date.end)
    if (type === 'between') {
        return (
            (groupStart.isAfter(start) || groupStart.isSame(start, 'day')) &&
            (groupEnd.isBefore(end) || groupEnd.isSame(end, 'day'))
        )
    }
    return groupStart.isSame(start, 'day') && groupEnd.isSame(end, 'day')
}

function passesTripLength(travelGroup:ClientTravelGroup, queryDays:string, queryType:string) {

    const mag = travelGroup.data.date.estLength[1]
    const groupDays = travelGroup.data.date.estLength[0] * (mag === 'days' ? 1 : mag === 'weeks' ? 7 : 30)

    const type = queryType ? queryType : 'exactly'

    if (type === 'exactly') {
        return groupDays === parseInt(queryDays)
    }
    if (type === 'at-least') {
        return groupDays >= parseInt(queryDays)
    }
    return groupDays <= parseInt(queryDays)
}

function passesDateFlexibility(travelGroup:ClientTravelGroup, unknown:string='', roughly:string='true', known:string='true') {
    if (unknown && travelGroup.data.date.unknown) {
        return true
    }
    if (roughly && travelGroup.data.date.roughly) {
        return true
    }
    return known && !travelGroup.data.date.unknown && !travelGroup.data.date.roughly
}

function passesDate(travelGroup:ClientTravelGroup, filters:Filters) {
    if (!passesDateFlexibility(travelGroup, filters.dateUnknown, filters.dateRougly, filters.dateKnown)) {
        return false
    }
    if (filters.lengthDays && !passesTripLength(travelGroup, filters.lengthDays, filters.lengthType)) {
        return false
    }
    if (filters.startDate && filters.endDate && 
        !passesDateRange(travelGroup, filters.startDate, filters.endDate, filters.dateSearchType)) {
        return false
    }
    return true
}

function passesDestination(travelGroup:ClientTravelGroup, city:string='', state:string='', country:string='', region:string='') {
    if (city && country) {
        return travelGroup.data.destination.combo.toLowerCase().includes(city.toLowerCase()) && 
        travelGroup.data.destination.combo.includes(country)
    }
    if (state && country) {
        return travelGroup.data.destination.combo.includes(state) && 
        travelGroup.data.destination.combo.includes(country)
    }
    if (country) {
        return travelGroup.data.destination.combo.includes(country)
    }
    return travelGroup.data.destination.combo.toLowerCase().includes(region)
}

function passesSearch(travelGroup:ClientTravelGroup, search:string) {
    if (!search) return true

    return travelGroup.data.name.toLowerCase().includes(search) || travelGroup.data.destination.combo.includes(search)
}

function passesFilters(travelGroup:ClientTravelGroup, filters:Filters) {

    return passesSearch(travelGroup, filters.search) && 
    passesDestination(travelGroup, filters.destinationCity, filters.destinationState, filters.destinationCountry, 
        filters.destinationRegion) &&
     passesDate(travelGroup, filters)
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