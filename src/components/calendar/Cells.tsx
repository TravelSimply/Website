import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import styles from '../../styles/Calendar.module.css'

interface Props {
    currentDate: Dayjs;
    tempRange: Dayjs[];
    dateRange: [Dayjs, Dayjs];
    onMouseDown: (day:Dayjs) => void;
    onMouseMove: (day:Dayjs) => void;
    onMouseUp: () => void;
}

interface Day {
    inMonth: boolean;
    status: string;
    date: Dayjs;
}

export default function Cells({currentDate, tempRange, dateRange, onMouseDown, onMouseMove, onMouseUp}:Props) {

    const [monthStart, monthEnd] = useMemo(() => {
        return [currentDate.startOf('month'), currentDate.endOf('month')]
    }, [currentDate])

    const [startDate, endDate] = useMemo(() => {
        return [monthStart.startOf('week'), monthEnd.endOf('week')]
    }, [monthStart, monthEnd])

    const [days, setDays] = useState<Day[]>([])

    useMemo(() => {
        const newDays = []
        for (let day = startDate; day.isBefore(endDate) || day.isSame(endDate, 'day'); day = day.add(1, 'day')) {
            newDays.push({
                inMonth: day.isSame(currentDate, 'month'),
                status: 'who cares yet',
                date: day
            })
        }
        setDays(newDays)
    }, [currentDate])

    return (
        <div className={styles.body} onMouseLeave={() => onMouseUp()}>
            {Array(days.length / 7).fill(null).map((_, row) => (
                <div className={styles.row} key={row}>
                    {Array(7).fill(null).map((_, col) => {
                        const day = days[(row * 7) + col]
                        let inTempRange = false, inDateRange = false
                        if (tempRange.length === 0) inTempRange = false
                        else if ((day.date.isAfter(tempRange[0]) || day.date.isSame(tempRange[0], 'day')) 
                        && (day.date.isBefore(tempRange[1]) || day.date.isSame(tempRange[1], 'day'))) {
                            inTempRange = true
                        }
                        if (inTempRange) inDateRange = false
                        else if ((day.date.isAfter(dateRange[0]) || day.date.isSame(dateRange[0], 'day')) 
                        && (day.date.isBefore(dateRange[1]) || day.date.isSame(dateRange[1], 'day'))) {
                            inDateRange = true
                        }
                        return (
                            <div className={`${styles.column} ${styles.cell} ${day.inMonth ? '' : styles.disabled} 
                            ${inTempRange ? styles.inRange : ''} ${inDateRange ? styles.inPrevSelectedRange : ''}`} key={col}
                            onMouseDown={() => onMouseDown(day.date)} onMouseUp={() => onMouseUp()}
                            onMouseMove={() => onMouseMove(day.date)} >
                                {day.inMonth && <span className={styles.number}>{day.date.format('D')}</span>}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}