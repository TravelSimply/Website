import dayjs, { Dayjs } from "dayjs";


export function findSentDiff(date:Dayjs) {
    let diff = dayjs().diff(date, 'days')
    if (diff >= 1) {
        return diff + ' days'
    }
    diff = dayjs().diff(date, 'hours')
    if (diff >= 1) {
        return diff + ' hours'
    }
    return dayjs().diff(date, 'minutes') + ' minutes'
}