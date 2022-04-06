import dayjs, {Dayjs} from "dayjs";
import { useState } from "react";
import styles from '../../styles/Calendar.module.css'
import Cells from "./Cells";
import Header from './Header'
import WeekDays from "./WeekDays";

interface Props {
    dateRange: [Dayjs, Dayjs];
    onDateRangeChange: (dateRange:[Dayjs, Dayjs]) => void;
}

export default function Calendar({dateRange, onDateRangeChange}:Props) {

    const [currentDate, setCurrentDate] = useState(dayjs())

    const [tempRange, setTempRange] = useState<Dayjs[]>([])

    const onMouseDown = (day:Dayjs) => {
        setTempRange([day, day, day])
    }

    const onMouseMove = (day:Dayjs) => {
        if (!tempRange[0]) return

        if (tempRange[0].isSame(day))  {
            return
        }

        if (tempRange[1].isSame(day)) {
            return
        }

        if (day.isBefore(tempRange[0])) {
            if (day.isBefore(tempRange[2])) {
                return setTempRange([day, tempRange[2], tempRange[2]])
            }
            return setTempRange([day, tempRange[2], tempRange[2]])
        }

        if (day.isAfter(tempRange[1])) {
            if (day.isAfter(tempRange[2])) {
                return setTempRange([tempRange[2], day, tempRange[2]])
            }
            return setTempRange([tempRange[0], day, tempRange[2]])
        }

        if (day.isAfter(tempRange[2])) {
            return setTempRange([tempRange[0], day, tempRange[2]])
        }

        setTempRange([day, tempRange[1], tempRange[2]])
    }

    const onMouseUp = () => {
        if (tempRange.length === 0) return

        if (dateRange[0] && dateRange[0].isSame(dateRange[1]) && tempRange[0].isSame(tempRange[1])) {
            const lower = dateRange[0].isBefore(tempRange[0]) ? dateRange[0] : tempRange[0]
            const upper = dateRange[0].isSame(lower) ? tempRange[0] : dateRange[0]

            setTempRange([])
            return onDateRangeChange([lower, upper])
        }

        const lower = tempRange[0].subtract(1, 'day').isSame(dateRange[1], 'day') ? dateRange[0] : tempRange[0]
        const upper = tempRange[1].add(1, 'day').isSame(dateRange[0], 'day') ? dateRange[1] : tempRange[1]

        setTempRange([])
        onDateRangeChange([lower, upper])
    }

    return (
        <div className={styles.calendar}>
            <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <WeekDays />
            <Cells dateRange={dateRange} tempRange={tempRange} onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} currentDate={currentDate} />
        </div>
    )
}