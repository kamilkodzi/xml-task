import fs from 'node:fs'
import { Transform, PassThrough, TransformCallback } from 'node:stream'
import path from 'path'
import { ActiveOfferMonitor } from './helpers/active-offer-monitor'
import { SplitInToOffer } from './helpers/split-in-to-offer'

export class AddIsActiveNode extends Transform {
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
    // Single offer is populated or not - to be validated
    const data = chunk.toString()

    callback(null, chunk)
  }
  _flush(callback: TransformCallback): void {
    // Not needed ?
    callback()
  }
}

const main = async () => {
  const feedURL = path.join(__dirname, './data/feed_sample.xml')
  const feedOutUrl = path.join(__dirname, './data/feed_sample_out.xml')
  const readStream = fs.createReadStream(feedURL, {
    highWaterMark: 3 * 1024,
  })
  const writeStream = fs.createWriteStream(feedOutUrl)

  readStream
    .pipe(new SplitInToOffer())
    .pipe(new AddIsActiveNode())
    .pipe(new ActiveOfferMonitor())
    .pipe(writeStream)
}

main()
