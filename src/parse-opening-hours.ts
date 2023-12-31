import { XMLBuilder, XMLParser } from 'fast-xml-parser'
const builder2 = new XMLBuilder({
  cdataPropName: 'is_active',
})

const parser = new XMLParser()

// Parsing opening_times node
const xml =
  '<opening_times><![CDATA[{"1":[{"opening":"10:00","closing":"22:30"}],"2":[{"opening":"10:00","closing":"22:30"}],"3":[{"opening":"10:00","closing":"22:30"}],"4":[{"opening":"10:00","closing":"22:30"}],"5":[{"opening":"10:00","closing":"22:30"}],"6":[{"opening":"10:00","closing":"22:30"}],"7":[],"timezone":"Europe/Warsaw"}]]></opening_times>'

const xml2 = parser.parse(xml)
console.log(JSON.parse(xml2.opening_times))
console.log('=================')

// Building is active node

const isActive = {
  is_active: {
    is_active: true,
  },
}
const notActive = {
  is_active: {
    is_active: false,
  },
}
const activeXml = builder2.build(isActive)
const notActiveXml = builder2.build(notActive)

console.log(activeXml)
console.log(activeXml.toString() === '<is_active><![CDATA[true]]></is_active>')

console.log(notActiveXml)
console.log(
  notActiveXml.toString() === '<is_active><![CDATA[false]]></is_active>'
)
