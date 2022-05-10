import { useEffect, useMemo, useState } from 'react'
import useSWR, {mutate} from 'swr'
import axios from 'axios'
import { ClientPopulatedUserNotifications } from '../../database/interfaces'
import dayjs, { Dayjs } from 'dayjs'

interface TravelGroup {
    id: string;
    lastUpdated?: {'@ts': string};
}

export interface UserNotifications {
    raw: ClientPopulatedUserNotifications;
    filtered: {
        time: Dayjs;
        new: boolean;
        type: 'basic' | 'travelGroup';
        data: any;
    }[];
}

export function useUserNotifications(user:string, travelGroups:string[]):UserNotifications {

    const {data} = useSWR<ClientPopulatedUserNotifications>(`/api/users/${user}/notifications`, {dedupingInterval: 60000})

    const [updatingTravelGroups, setUpdatingTravelGroups] = useState(false)
    const [formattedData, setFormattedData] = useState(null)

    const updateTravelGroups = async (groups:TravelGroup[]) => {
        setUpdatingTravelGroups(true)

        try {

            await axios({
                method: 'POST',
                url: `/api/users/notifications/add-travel-groups`,
                data: {
                    id: data.notifications.ref['@ref'].id,
                    travelGroups: groups
                }
            })

            setUpdatingTravelGroups(false)
            mutate(`/api/users/${user}/notifications`)
        } catch (e) {
            setUpdatingTravelGroups(false)
            console.log(e)
        }
    }

    useEffect(() => {
        if (!data) return

        const groupsToAdd = []
        for (const group of travelGroups) {
            if (!data.travelGroups.find(g => g[0] === group)) {
                groupsToAdd.push({id: group})
            }
        }

        if (groupsToAdd.length > 0 && !updatingTravelGroups) {
            updateTravelGroups([...data.notifications.data.travelGroups, ...groupsToAdd])
        }
    }, [data])

    useMemo(() => {

        if (!data) return

        const basic = data.notifications.data.basic.map((item) => ({
            time: dayjs(item.time['@ts']),
            type: 'basic',
            data: item,
            new: !item.seen && item.content?.travelGroupName.length > 0
        }))

        const groups = data.notifications.data.travelGroups.map(group => {
            const groupUpdate = data.travelGroups.find(g => g[0] === group.id)
            if (!groupUpdate) return null
            return {
                time: groupUpdate[1] ? dayjs(groupUpdate[1]['@ts']) : dayjs(group.lastUpdated['@ts']),
                type: 'travelGroup',
                data: groupUpdate,
                new: groupUpdate[1] && dayjs(group.lastUpdated['@ts']).isBefore(dayjs(groupUpdate[1]['@ts']))
            }
        }).filter(g => g)

        setFormattedData([...basic, ...groups].sort((a, b) => b.time.diff(a.time)))
    }, [data])

    return {
        raw: data,
        filtered: formattedData
    }
}