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
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const lastOfferClosingTag = (this.tail + chunk.toString()).lastIndexOf(
      '</offer>'
    )

    if (lastOfferClosingTag !== -1) {
      // To be handled
      console.log('last index of </offer>: ', lastOfferClosingTag)
      const pieces = (this.tail + chunk.toString()).split('</offer>')
      console.log('length of pieces: ', pieces.length)
      pieces.pop()
      // console.log(pieces)
      // It
      // this.tail = chunk.subarray(lastOfferClosingTag + 8).toString()
      // if (pieces.length > 1) {
      console.log('There is more elements in pieces')
      // there is just one element in array
      const joined = pieces.join('</offer_new>') + '</offer_new>'
      this.tail = this.tail + chunk.toString()
      console.log(joined)
      // } else {
      //   console.log('There is just one element in pieces')
      //   // there is just one element in array
      //   const joined = pieces[0] + '</offer_new>'
      //   console.log(joined)
      // }
    } else {
      // there is no </offer> tag in previous + current chunk
      // so all is stored in to tail propertie for further processing
      this.tail = this.tail + chunk.toString()
      console.log('There is no </offer> in current buffer')
      // Check how to filter data - if there is curicumstances that we dont want send data,
      // just to iterate to next cb - to be checked hot to do not send / push data
    }

    // this.tail = chunk.subarray(lastOfferClosingTag + 8)

    // console.log(pieces)
    this.tail = chunk.subarray(lastOfferClosingTag + 8).toString()
    // console.log('pieces, ', pieces)
    // console.log(this.tail.toString())
    // console.log(chunk.toString())
    // const pieces = (this.tail + chunk).split(this.searchStr)
    // const lastPiece = pieces[pieces.length - 1]
    // const tailLen = this.searchStr.length - 1
    // this.tail = lastPiece.slice(-tailLen)
    // pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)

    // this.push(pieces.join(this.replaceStr))
    // callback()
  }
  _flush(callback: TransformCallback): void {
    // this.push(this.tail)
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
