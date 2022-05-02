import { IconButton, Typography } from '@mui/material';
import dayjs, {Dayjs} from 'dayjs'
import { Dispatch, SetStateAction } from 'react';
import styles from '../../styles/Calendar.module.css'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface Props {
    currentDate: Dayjs;
    setCurrentDate: Dispatch<SetStateAction<Dayjs>>;
}

export default function Header({currentDate, setCurrentDate}:Props) {

    const next = () => {
        setCurrentDate(currentDate.add(1, 'month'))
    }

    const prev = () => {
        setCurrentDate(currentDate.subtract(1, 'month'))
    }

    return (
        <div className={`${styles.header} ${styles.row} ${styles.flexMiddle}`}>
            <div className={`${styles.column} ${styles.colStart}`}>
                <IconButton disabled={currentDate.add(1, 'month').isBefore(dayjs().startOf('month'))} onClick={() => prev()}>
                    <NavigateBeforeIcon /> 
                </IconButton>
            </div>
            <div className={`${styles.column} ${styles.colCenter}`}>
                <span>
                    <Typography variant="h5">
                        {currentDate.format('MMMM YYYY')}
                    </Typography>
                </span>
            </div>
            <div className={`${styles.column} ${styles.colEnd}`}>
                <IconButton onClick={() => next()}>
                    <NavigateNextIcon />
                </IconButton>
            </div>
        </div>
    )
}