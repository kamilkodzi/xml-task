import { Transform, TransformCallback } from 'node:stream'
import {
  getOpeningTimes,
  injectXMLInToOffer,
  isActive,
  isXMLOffer,
} from './xml-helpers'
import { active, getCurrentDay } from './time-helpers'
import { Weekday } from './types'

export class AddIsActiveNode extends Transform {
  currentDay: Weekday
  dateTimestamp: Date
  constructor(dateTimestamp: Date, opts?: any) {
    super({ ...opts })
    this.currentDay = getCurrentDay(dateTimestamp)
    this.dateTimestamp = dateTimestamp
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const data = chunk.toString()

    if (!isXMLOffer(data)) {
      // Chunk do not contains <offer>*</offer> node, pasting chunk to buffer and moving along
      callback(null, chunk)
      return
    }

    // Getting opening_times node from xml
    const openingTimes = getOpeningTimes(data)

    // Check if opening times node exist at all if not, offer is not active
    if (!openingTimes) {
      const newData = injectXMLInToOffer(data, isActive.false)
      this.push(newData)
      callback()
      return
    }

    // Getting array with open & closing times for current day
    const openingTimesForCurrenDay = openingTimes[this.currentDay]

    // If there is no opening times for current day then offer is not active
    if (!openingTimesForCurrenDay) {
      const newData = injectXMLInToOffer(data, isActive.false)
      this.push(newData)
      callback()
      return
    }

    const isActiveOffer = openingTimesForCurrenDay.some(
      active(this.dateTimestamp)
    )
    if (isActiveOffer) {
      const newData = injectXMLInToOffer(data, isActive.true)
      this.push(newData)
      callback()
      return
    }

    // When previous logic fails, set offer as not active
    const newData = injectXMLInToOffer(data, isActive.false)
    this.push(newData)
    callback()
  }
}
