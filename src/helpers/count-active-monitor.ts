import { PassThrough, TransformCallback } from 'node:stream'

/**
 * Monitor must recieve single offer in chunk,
 * If single offer is not provided then counts will ne not accurate
 * @param {any} opt - Please check PassThrough implementation for detalis
 */
export class ActiveOfferMonitor extends PassThrough {
  activeOffers: number
  nonActiveOffers: number
  dateTimestamp: Date
  constructor(dateTimestamp: Date, opts?: any) {
    super({ ...opts })
    this.activeOffers = 0
    this.nonActiveOffers = 0
    this.dateTimestamp = dateTimestamp
  }
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const data: string = chunk.toString()
    data.includes('<is_active><![CDATA[true]]></is_active>')
      ? this.activeOffers++
      : null
    data.includes('<is_active><![CDATA[false]]></is_active>')
      ? this.nonActiveOffers++
      : null
    callback(null, chunk)
  }
  _flush(callback: TransformCallback): void {
    const finishTime = new Date()
    const processingTime =
      (finishTime.getTime() - this.dateTimestamp.getTime()) / 1000
    console.clear()
    console.log(`
      =================================
      | ${this.dateTimestamp.toUTCString()} |
      =================================
        Active offers: ${this.activeOffers}
        Paused offers: ${this.nonActiveOffers}

        Processing time: ${processingTime} sec
      =================================
      `)
    callback()
  }
}
