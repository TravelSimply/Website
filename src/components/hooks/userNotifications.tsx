import { useEffect, useMemo, useState } from 'react'
import useSWR, {mutate} from 'swr'
import axios from 'axios'

interface TravelGroup {
    id: string;
    lastUpdated?: {'@ts': string};
}

export function useUserNotifications(user:string, travelGroups:string[]) {

    const {data} = useSWR(`/api/users/${user}/notifications`)

    const [updatingTravelGroups, setUpdatingTravelGroups] = useState(false)

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

    return data
}