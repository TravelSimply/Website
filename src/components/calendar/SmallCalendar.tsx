import dayjs, {Dayjs} from "dayjs";
import { useMemo, useState } from "react";
import { ClientPopulatedAvailability } from "../../database/interfaces";
import styles from '../../styles/Calendar.module.css'
import Cells from "./Cells";
import Header from './Header'
import WeekDays from "./WeekDays";

interface Props {
    availability: ClientPopulatedAvailability;
}

export default function SmallCalendar({availability}:Props) {

    const [currentDate, setCurrentDate] = useState(dayjs())
    
    const dateRange = useMemo<[Dayjs, Dayjs]>(() => [dayjs().subtract(1000, 'years'), dayjs().subtract(1000, 'years')], [])

    const tempRange = useMemo(() => [], [])

    const onMouseDown = (a) => {}

    const onMouseMove = (a) => {}

    const onMouseUp = () => {}

    return (
        <div className={styles.calendar}>
            <Cells dateRange={dateRange} tempRange={tempRange} onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} currentDate={currentDate} displayOnly small hoverColor="auto"
            availability={availability} />
        </div>
    )
}