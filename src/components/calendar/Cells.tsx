import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import styles from '../../styles/Calendar.module.css'

interface Props {
    currentDate: Dayjs;
}

interface Day {
    inMonth: boolean;
    status: string;
    date: Dayjs;
}

export default function Cells({currentDate}:Props) {

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
        <div className={styles.body}>
            {Array(days.length / 7).fill(null).map((_, row) => (
                <div className={styles.row} key={row}>
                    {Array(7).fill(null).map((_, col) => {
                        const day = days[(row * 7) + col]
                        return (
                            <div className={`${styles.column} ${styles.cell} ${day.inMonth ? '' : styles.disabled}`} key={col}>
                                {day.inMonth && <span className={styles.number}>{day.date.format('D')}</span>}

                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}