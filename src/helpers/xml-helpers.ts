import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { OpeningTimes } from './types'
const parser = new XMLParser()

/**
 *
 * @param {strin} offerXML - string that contains offer node in xml format,
 *
 * when opening_times node will be not found return null
 *
 * when opening_times node will be parsed, return OpeningTimes
 *
 * when JSON parse fail, throw new Error
 *
 */
export const getOpeningTimes = (
  offerXML: string
): OpeningTimes | null | never => {
  const regex = /<opening_times>.*<\/opening_times>/s
  const match = offerXML.match(regex)
  if (!match) return null

  try {
    const openingTimesXML = match[0]
    const openingTimesStringified = parser.parse(openingTimesXML)
    const openingTimes = JSON.parse(openingTimesStringified.opening_times)
    return openingTimes
  } catch (error) {
    throw new Error(
      'opening_times do not contain valis JSON data and could not be parsed. Please contact with customer'
    )
  }
}

const builder = new XMLBuilder({
  cdataPropName: 'is_active',
})

const activeObj = {
  is_active: {
    is_active: true,
  },
}
const notActiveObj = {
  is_active: {
    is_active: false,
  },
}
const activeXML: string = builder.build(activeObj)
const notActiveXML: string = builder.build(notActiveObj)

export const isActive = {
  true: activeXML,
  false: notActiveXML,
}

export const injectXMLInToOffer = (
  data: string,
  xmlToInject: string
): string => {
  const injectedData = data.replace(
    '</offer>',
    '\t' + xmlToInject + '\n</offer>'
  )
  return injectedData
}

export const isXMLOffer = (data: string): boolean => {
  const regex = /<offer>.*<\/offer>/s
  const match = data.match(regex)
  if (!match) return false
  return true
}
