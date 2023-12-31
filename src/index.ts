import fs from 'node:fs'
import { Transform } from 'node:stream'

const main = async () => {
  const readStream = fs.createReadStream('src/data/feed_sample.xml')
  const writeStream = fs.createWriteStream('src/data/feed_sample_out.xml')

  readStream
    .pipe(
      new Transform({
        // to be moved out and to create state for chunks-ends
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          console.log('data chunk: ', chunk)
          callback(null, chunk)
        },
      })
    )
    .pipe(writeStream)
}

main()
