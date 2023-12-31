import fs from 'node:fs'
import { Transform } from 'node:stream'
import { TransformCallback } from 'stream'
import path from 'path'

class ReplaceStream extends Transform {
  tail: string
  searchStr = 'EUR'
  replaceStr = 'PLN'
  constructor(opts?: any) {
    super({ ...opts })
    this.tail = ''
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const pieces = (this.tail + chunk).split(this.searchStr)
    const lastPiece = pieces[pieces.length - 1]
    const tailLen = this.searchStr.length - 1
    this.tail = lastPiece.slice(-tailLen)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
    this.push(pieces.join(this.replaceStr))
    callback()
  }
  _flush(callback: TransformCallback): void {
    this.push(this.tail)
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

  readStream.pipe(new ReplaceStream()).pipe(writeStream)
}

main()
