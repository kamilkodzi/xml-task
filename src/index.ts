import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import path from 'path'
import { ActiveOfferMonitor } from './helpers/count-active-monitor'
import { SplitInToOffer } from './helpers/split-offers-transform'
import { AddIsActiveNode } from './helpers/is-active-transform'

const dateTimestamp = new Date()

const main = async () => {
  const feedURL = path.join(__dirname, './data/feed_sample.xml')
  const feedOutUrl = path.join(__dirname, './data/feed_sample_out.xml')
  const readStream = createReadStream(feedURL)
  const writeStream = createWriteStream(feedOutUrl)

  pipeline(
    readStream,
    new SplitInToOffer(),
    new AddIsActiveNode(dateTimestamp),
    new ActiveOfferMonitor(dateTimestamp),
    writeStream,
    (err) => {
      if (err) {
        console.log(err)
        process.exit(1)
      }
    }
  )
}

main()
