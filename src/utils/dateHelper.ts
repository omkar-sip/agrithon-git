// src/utils/dateHelper.ts
import { format, differenceInDays, addDays, isToday, isTomorrow } from 'date-fns'

export const formatDate = (date: Date | string | number) =>
  format(new Date(date), 'dd MMM yyyy')

export const formatTime = (date: Date | string | number) =>
  format(new Date(date), 'hh:mm a')

export const daysSince = (date: Date | string | number) =>
  differenceInDays(new Date(), new Date(date))

export const daysUntil = (date: Date | string | number) =>
  differenceInDays(new Date(date), new Date())

export const addDaysToDate = (date: Date, days: number) => addDays(date, days)

export const isDateToday = (date: Date | string) => isToday(new Date(date))
export const isDateTomorrow = (date: Date | string) => isTomorrow(new Date(date))

export const getRelativeDay = (date: Date | string): string => {
  if (isToday(new Date(date)))    return 'Today'
  if (isTomorrow(new Date(date))) return 'Tomorrow'
  return format(new Date(date), 'EEE, dd MMM')
}

export const msToHours = (ms: number) => ms / (1000 * 60 * 60)
export const isOlderThan = (timestamp: number, hours: number) =>
  (Date.now() - timestamp) > hours * 60 * 60 * 1000
