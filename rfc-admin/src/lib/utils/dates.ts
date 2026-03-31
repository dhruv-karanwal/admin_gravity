import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = 'Asia/Kolkata';

export const formatDate     = (ts: any) => dayjs(ts?.toDate?.() ?? ts).tz(IST).format('DD MMM YYYY');
export const formatDateTime = (ts: any) => dayjs(ts?.toDate?.() ?? ts).tz(IST).format('DD MMM YYYY, hh:mm A');
export const formatTime     = (ts: any) => dayjs(ts?.toDate?.() ?? ts).tz(IST).format('hh:mm A');
export const daysUntil      = (ts: any) => dayjs(ts?.toDate?.() ?? ts).tz(IST).diff(dayjs().tz(IST), 'day');
export const isToday        = (ts: any) => dayjs(ts?.toDate?.() ?? ts).tz(IST).isSame(dayjs().tz(IST), 'day');

export default dayjs;
