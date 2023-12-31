import fs from 'node:fs'
//@ts-ignore
import XmlStream from 'xml-stream'
import sax from 'sax'
import { Transform, Writable } from 'node:stream'
import saxStream from 'sax-stream'
import json2xml from 'json2xml'

function getTransformStream() {
  let liner = new Transform({ objectMode: true })

  liner._transform = function (data, encoding, done) {
    // have your transforms here
    // console.log('type of data: ', typeof data)
    this.push(data)
    // console.log(data)
    // console.log('=======================')
    done()
  }

  liner._flush = function (done) {
    // console.log('DONE DONE DONE DONE')
    done()
  }

  let fileStream = fs.createReadStream('src/input-data/feed_sample.xml')

  let xmlStream = new XmlStream(fileStream)

  let counter = 0

  xmlStream.on('endElement: offer', function (el: any) {
    liner.write(JSON.stringify(el))
    counter += 1
  })

  xmlStream.on('end', function () {
    // console.log(counter)
    liner.end()
  })

  return liner
}

const main0 = () => {
  const inputFile = fs.createReadStream('src/input-data/feed_sample.xml')
  const outputFile = fs.createWriteStream('src/output-data/expoert_feed.xml')

  const xml = new XmlStream(inputFile)

  xml.on('updateElement: offer', function (offer: any) {
    offer.is_active = true
    console.log('poprawiona offerta: ', offer)
  })

  xml.preserve('offer', true)

  xml.on('endElement: offer', function (offer: any) {
    outputFile.write(xml.toString(offer))
  })

  // inputFile.pipe(xml)
}

const main = async () => {
  const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
  const writeStream = fs.createWriteStream('src/output-data/expoert_feed.xml')
  const xml = new XmlStream(readStream)
  xml.on('updateElement: offer', (node: any) => {
    console.log('offer: ', node.id)
    const openingTimes = JSON.parse(node.opening_times)
    console.log(openingTimes)
  })
  xml.on('error', (message: any) => {
    console.log('Parsing' + ' failed: ' + message)
  })
  xml.on('end', () => {
    writeStream.end()
  })

  // xml.pipe(
  //   new Transform({
  //     transform(chunk, enc, cb) {
  //       console.log('chunk here: ', chunk)
  //       cb(null, chunk)
  //     },
  //   })
  // )
  // return xml
  // xml.preserve('offer', true)
  // xml.collect('offer')
  // xml.on('endElement: offer', function (item: any) {
  //   console.log(item)
  // })
}

const main2 = async () => {
  const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
  const writeStream = fs.createWriteStream('src/output-data/export_feed.xml')
  readStream
    .pipe(saxStream({ strict: true, tag: 'offer' }))
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, enc, cb) {
          console.log('chunk here: ', chunk)

          cb(null, chunk.toString())
        },
      })
    )
    .pipe(writeStream)
    .on('data', (item) => {
      console.log('data chunk: ', item)
    })
}

const main3 = async () => {
  const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
  const writeStream = fs.createWriteStream('src/output-data/export_feed.xml')
  const streamSax = sax.createStream(true)
  // const parser = sax.parser(true)

  // parser.onerror = function (e) {
  //   // an error happened.
  // }
  // parser.ontext = function (t) {
  //   // got some text.  t is the string of text.
  // }
  // parser.onopentag = function (node) {
  //   console.log(node)
  //   // opened a tag.  node has "name" and "attributes"
  // }
  // parser.onattribute = function (attr) {
  //   console.log(attr)
  //   // an attribute.  attr has "name" and "value"
  // }
  // parser.onend = function () {
  //   // parser stream is done, and ready to have more stuff written to it.
  // }

  // // parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close()

  // streamSax.on('error', function (e) {
  //   // unhandled errors will throw, since this is a proper node
  //   // event emitter.
  //   console.error('error!', e)
  //   // clear the error
  //   //@ts-ignore
  //   this._parser.error = null
  //   this._parser.resume()
  // })

  // streamSax.on('attribute', function (tag) {
  //   if ((tag.name = 'opening_times')) console.log('tag data', tag)
  // })

  readStream
    .pipe(streamSax)
    .pipe(
      new Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          let data = chunk.toString()

          console.log('data chunk: ', data)
          data = 'test'
          this.push(data)
          callback()
        },
      })
    )
    .pipe(writeStream)
  // .pipe(
  //   new Transform({
  //     transform(chunk, enc, cb) {
  //       console.log('chunk here: ', chunk)
  //       cb(null, chunk)
  //     },
  //   })
  // )
  // .on('data', (item) => {
  //   // console.log('data chunk: ', item)
  // })
}

getTransformStream().pipe(
  fs.createWriteStream('src/output-data/export_feed.xml')
)
