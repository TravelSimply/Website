import dayjs, {Dayjs} from "dayjs";
import { useState } from "react";
import styles from '../../styles/Calendar.module.css'
import Cells from "./Cells";
import Header from './Header'
import WeekDays from "./WeekDays";

export default function Calendar() {

    const [currentDate, setCurrentDate] = useState(dayjs())
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([])

    return (
        <div className={styles.calendar}>
            <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <WeekDays />
            <Cells currentDate={currentDate} />
        </div>
    )
}