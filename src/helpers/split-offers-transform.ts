import { Transform, TransformCallback } from 'node:stream'

/**
 * Ensure that in single chunk there will be up to one offer.
 * Potentaialy could be on offer at all or just xml header.
 */
export class SplitInToOffer extends Transform {
  tail: string
  constructor(opts?: any) {
    super({ ...opts })
    this.tail = ''
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    // Potential risk with another <offer> inside CDATA - TBC in future (marked in README)
    const data = chunk.toString()
    const lastClosingTagIndex = (this.tail + data).lastIndexOf('</offer>')

    if (lastClosingTagIndex !== -1) {
      const offers = (this.tail + data).split('</offer>')
      offers.pop()
      offers.forEach((offer) => {
        const tagClosedOffer = offer + '</offer>'
        this.push(tagClosedOffer)
      })
      this.tail = (this.tail + data).slice(lastClosingTagIndex + 8).toString()
      callback()
    } else {
      // There is no </offer> tag in previous + current chunk
      // so all is stored in to tail propertie for further processing
      this.tail = this.tail + data
      callback()
    }
  }
  _flush(callback: TransformCallback): void {
    this.push(this.tail)
    callback()
  }
}
