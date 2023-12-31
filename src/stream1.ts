import fs from 'node:fs'
import sax from 'sax'
import { Transform, Writable } from 'node:stream'

const main = async () => {
  const readStream = fs.createReadStream('src/input-data/feed_sample.xml')
  const writeStream = fs.createWriteStream('src/output-data/export_feed.xml')
  const saxStream = sax.createStream(true)

  readStream
    .pipe(saxStream)
    .pipe(
      new Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          let data = chunk.toString()
          console.log('data chunk: ', chunk)
          // data = 'test'
          // this.push(data)
          callback(null, chunk)
        },
      })
    )
    .pipe(writeStream)

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

  // readStream
  //   .pipe(saxStream)
  //   .pipe(
  //     new Transform({
  //       writableObjectMode: true,
  //       transform(chunk, encoding, callback) {
  //         let data = chunk.toString()

  //         // console.log('data chunk: ', data)
  //         data = 'test'
  //         this.push(data)
  //         callback()
  //       },
  //     })
  //   )
  //   .pipe(writeStream)
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

main()
