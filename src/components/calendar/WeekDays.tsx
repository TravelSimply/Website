import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import styles from '../../styles/Calendar.module.css'

export default function WeekDays() {

    const weekDays = useMemo(() => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], [])

    return (
        <div className={`${styles.days} ${styles.row}`}>
            {weekDays.map(day => (
                <div key={day} className={`${styles.column} ${styles.colCenter}`}>
                    <Typography variant="subtitle2">
                        {day}
                    </Typography>
                </div>
            ))} 
        </div>
    )
}