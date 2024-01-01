export type TimeSlot = {
  opening?: string
  closing?: string
}
export type Weekday = '1' | '2' | '3' | '4' | '5' | '6' | '7'

export type OpeningTimes = Record<Weekday, TimeSlot[]>
