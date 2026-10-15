import type { XmlElement } from '../../xml/types/XmlElement'
import { xadesUris } from '../xadesUris'
import { buildElement } from './buildElement'
import { buildText } from './buildText'

/** A ds:Transform; the XPath one carries AutoFirma's filter that drops the signature. */
export const buildTransform = (ds: string, algorithm: string): XmlElement =>
  buildElement(
    `${ds}:Transform`,
    { Algorithm: algorithm },
    algorithm === xadesUris.xpath
      ? [
          buildElement(`${ds}:XPath`, {}, [
            buildText(`not(ancestor-or-self::${ds}:Signature)`),
          ]),
        ]
      : [],
  )
