import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import styles from '../../styles/Calendar.module.css'

interface Props {
    currentDate: Dayjs;
    tempRange: Dayjs[];
    dateRange: [Dayjs, Dayjs];
    onMouseDown: (day:Dayjs) => void;
    onMouseMove: (day:Dayjs) => void;
    onMouseUp: () => void;
    displayOnly?: boolean;
    small?: boolean;
}

interface Day {
    inMonth: boolean;
    status: string;
    date: Dayjs;
}

export default function Cells({currentDate, tempRange, dateRange, onMouseDown, onMouseMove, onMouseUp, displayOnly,
    small}:Props) {

    const calcInTempRange = useCallback((day:Day) => {
        if (tempRange.length === 0) {
            return false
        }
        if ((day.date.isAfter(tempRange[0]) || day.date.isSame(tempRange[0], 'day')) 
        && (day.date.isBefore(tempRange[1]) || day.date.isSame(tempRange[1], 'day'))) {
            return true 
        }
        return false
    }, [tempRange])

    const calcInDateRange = useCallback((day:Day) => {
        if ((day.date.isAfter(dateRange[0]) || day.date.isSame(dateRange[0], 'day')) 
        && (day.date.isBefore(dateRange[1]) || day.date.isSame(dateRange[1], 'day'))) {
            return true
        }
        return false
    }, [dateRange])

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
                        const inTempRange = calcInTempRange(day)
                        const inDateRange = inTempRange ? false : calcInDateRange(day)
                        return (
                            <div className={`${styles.column} ${styles.cell} ${day.inMonth ? '' : styles.disabled} 
                            ${inTempRange ? styles.inRange : ''} ${inDateRange ? styles.inPrevSelectedRange : ''}
                            ${displayOnly ? styles.displayOnly : ''} ${small ? styles.small : ''}`} key={col}
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