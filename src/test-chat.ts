import fs from 'fs'
import sax from 'sax'
import stream from 'stream'

const inputFile = 'src/input-data/feed_sample.xml'
const outputFile = 'src/output-data/export_feed.xml'

const readable = fs.createReadStream(inputFile)
const writable = fs.createWriteStream(outputFile)

const parser = sax.createStream(true)
let inOffer = false
let openingTimes = ''

readable
  .pipe(parser)
  .pipe(
    new stream.Transform({
      writableObjectMode: true,
      transform(chunk, encoding, callback) {
        let data = chunk.toString()
        
        if (data.includes('<offer>')) {
          inOffer = true
        }
        if (inOffer && data.includes('<opening_times>')) {
          openingTimes = data
            .split('<opening_times>')[1]
            .split('</opening_times>')[0]
        }
        if (inOffer && data.includes('</offer>')) {
          //   const isActive = analyzeOpeningTimes(openingTimes) ? 'true' : 'false'
          const isActive = true
          data = data.replace(
            '</offer>',
            `<is_active>${isActive}</is_active></offer>`
          )
          inOffer = false
        }
        this.push(data)
        callback(null, data)
      },
    })
  )
  .pipe(writable)

// function analyzeOpeningTimes(openingTimes) {
//   // Tutaj dodaj logikę analizy openingTimes
//   // Zwróć true lub false w zależności od wyniku analizy
// }
