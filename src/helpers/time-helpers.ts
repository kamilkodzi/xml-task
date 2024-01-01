import { TimeSlot, Weekday } from './types'

export const active = (dateTimestamp: Date) => {
  return function (hours: TimeSlot) {
    const { opening, closing } = hours
    if (!opening || !closing) return false
    const currentUTCHour = dateTimestamp.getUTCHours()
    const currentUTCMinutes = dateTimestamp.getUTCMinutes()

    // Counting minutes past after midnight
    const openingMinutes =
      parseInt(opening?.split(':')[0]) * 60 + parseInt(opening?.split(':')[1])
    let closingMinutes =
      parseInt(closing?.split(':')[0]) * 60 + parseInt(closing?.split(':')[1])
    // Exception for 00:00 on closing time, time will be set in to "24:00"
    if (closingMinutes === 0) closingMinutes = 24 * 60
    const currentMinutes = currentUTCHour * 60 + currentUTCMinutes

    const isActive =
      currentMinutes >= openingMinutes && currentMinutes <= closingMinutes
    return isActive
  }
}

export const getCurrentDay = (date?: Date): Weekday => {
  // Convert standard 0-6
  const currentDay = date?.getDay() ?? new Date().getDay()
  // in to 1 - Monday, 7 - Sunday
  const weekDayConvert1to7 = ['7', '1', '2', '3', '4', '5', '6']
  const day = weekDayConvert1to7[currentDay] as Weekday
  return day
}
