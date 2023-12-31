import sax from 'sax'
import fs from 'node:fs'

const parser = sax.parser(true)

parser.onerror = function (e) {
  // an error happened.
}
parser.ontext = function (t) {
  // got some text.  t is the string of text.
}
parser.onopentag = function (node) {
  // opened a tag.  node has "name" and "attributes"
}
parser.onattribute = function (attr) {
  // an attribute.  attr has "name" and "value"
}
parser.onend = function () {
  // parser stream is done, and ready to have more stuff written to it.
}

parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close()

const saxStream = sax.createStream(true)

fs.createReadStream('src/input-data/feed_sample.xml')
  .pipe(saxStream)
  .pipe(fs.createWriteStream('src/output-data/expoert_feed.xml'))
