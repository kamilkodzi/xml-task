// import fs from 'fs'
// import { createWriteStream } from 'fs'
// import { Parser } from 'xml2js'
// import { Transform } from 'stream'

// const parser = new Parser()
// const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
// const writeStream = createWriteStream('src/output-data/expoert_feed.xml')

// let activeCount = 0
// let pausedCount = 0

// const transformStream = new Transform({
//   transform(chunk, encoding, callback) {
//     const offer = JSON.parse(chunk.toString())
//     const openingTimes = JSON.parse(offer.opening_times)
//     const date = new Date()
//     const currentHour = date.getUTCHours()
//     const currentDay = date.getUTCDay()

//     const timesForToday = openingTimes[currentDay]
//     let isActive = false

//     for (const time of timesForToday) {
//       const openingHour = parseInt(time.opening.split(':')[0])
//       const closingHour = parseInt(time.closing.split(':')[0])

//       if (currentHour >= openingHour && currentHour <= closingHour) {
//         isActive = true
//         break
//       }
//     }

//     offer.is_active = isActive ? 'true' : 'false'
//     this.push(JSON.stringify(offer))
//     callback()

//     if (isActive) {
//       activeCount++
//     } else {
//       pausedCount++
//     }
//   },
// })

// readStream
//   .pipe(parser as any)
//   .pipe(transformStream)
//   .pipe(writeStream)

// transformStream.on('finish', () => {
//   console.log(`Active offers: ${activeCount}`)
//   console.log(`Paused offers: ${pausedCount}`)
// })

import fs from 'fs'
import { createWriteStream } from 'fs'
import { Parser } from 'xml2js'
import { Transform } from 'stream'

const parser = new Parser()
const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
const writeStream = createWriteStream('src/output-data/expoert_feed.xml')

let activeCount = 0
let pausedCount = 0

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const offer = JSON.parse(chunk.toString())
    const openingTimes = JSON.parse(offer.opening_times)
    const date = new Date()
    const currentHour = date.getUTCHours()
    const currentDay = date.getUTCDay()

    const timesForToday = openingTimes[currentDay]
    let isActive = false

    for (const time of timesForToday) {
      const openingHour = parseInt(time.opening.split(':')[0])
      const closingHour = parseInt(time.closing.split(':')[0])

      if (currentHour >= openingHour && currentHour <= closingHour) {
        isActive = true
        break
      }
    }

    offer.is_active = isActive ? 'true' : 'false'
    this.push(JSON.stringify(offer))
    callback()

    if (isActive) {
      activeCount++
    } else {
      pausedCount++
    }
  },
})

// readStream.pipe(parser)

parser.on('readable', () => {
  let offer
  //   while ((offer = parser.read())) {
  //     transformStream.write(offer)
  //   }
})

transformStream.pipe(writeStream)

transformStream.on('finish', () => {
  console.log(`Active offers: ${activeCount}`)
  console.log(`Paused offers: ${pausedCount}`)
})
