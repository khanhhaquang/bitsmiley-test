import dayjs, { OpUnitType } from 'dayjs'
import isTodayPlugin from 'dayjs/plugin/isToday'

dayjs.extend(isTodayPlugin)

export const isBeforeNow = (date: string, unit?: OpUnitType) => {
  return dayjs(date).isBefore(new Date(), unit || 'second')
}

export const isToday = (date: string) => dayjs(date).isToday()
