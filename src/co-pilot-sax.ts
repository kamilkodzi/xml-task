// import fs from 'fs'
// import sax from 'sax'
// import { createWriteStream } from 'fs'
// import { Transform } from 'stream'

// const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
// const writeStream = createWriteStream('src/output-data/expoert_feed.xml')

// let activeCount = 0
// let pausedCount = 0

// const parser = sax.createStream(true)
// let inOffer = false
// let offer: any = {}

// readStream.pipe(parser)

// parser.on('opentag', (node) => {
//   if (node.name === 'offer') {
//     inOffer = true
//     offer = {}
//   }
// })

// parser.on('closetag', (nodeName) => {
//   if (nodeName === 'offer') {
//     inOffer = false

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
//     writeStream.write(JSON.stringify(offer))

//     if (isActive) {
//       activeCount++
//     } else {
//       pausedCount++
//     }
//   }
// })

// parser.on('text', (text) => {
//   if (inOffer) {
//     offer[parser.tag.name] = text
//   }
// })

// parser.on('end', () => {
//   console.log(`Active offers: ${activeCount}`)
//   console.log(`Paused offers: ${pausedCount}`)
// })

import fs from 'fs'
import sax from 'sax'
import { createWriteStream } from 'fs'
import { Transform } from 'stream'

const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
const writeStream = createWriteStream('src/output-data/expoert_feed.xml')

let activeCount = 0
let pausedCount = 0

const parser = sax.createStream(true)
let inOffer = false
let offer: any = {}
let lastOpenTag: string

readStream.pipe(parser)

parser.on('text', (node) => {
  console.log('text node: ', node)
  if (node === 'offer') {
    inOffer = true
    offer = {}
  }
  //   lastOpenTag = node.name
})
parser.on('data', (chunk) => {
  console.log('data: ', chunk)
})
parser.on('closetag', (nodeName) => {
  console.log('closetag node: ', nodeName)
  if (nodeName === 'offer') {
    inOffer = false

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
    writeStream.write(JSON.stringify(offer))

    if (isActive) {
      activeCount++
    } else {
      pausedCount++
    }
  }
})

parser.on('text', (text) => {
  if (inOffer) {
    offer[lastOpenTag] = text
  }
})

parser.on('end', () => {
  console.log(`Active offers: ${activeCount}`)
  console.log(`Paused offers: ${pausedCount}`)
})
