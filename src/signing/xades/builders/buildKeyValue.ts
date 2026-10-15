import type { X509Certificate } from 'node:crypto'

import type { XmlElement } from '../../xml/types/XmlElement'
import { rsaKeyValue } from '../mappers/rsaKeyValue'
import { buildElement } from './buildElement'
import { buildTextElement } from './buildTextElement'

/** ds:KeyValue holding the signer's RSAKeyValue. */
export const buildKeyValue = (
  ds: string,
  certificate: X509Certificate,
): XmlElement => {
  const { modulus, exponent } = rsaKeyValue(certificate)
  return buildElement(`${ds}:KeyValue`, {}, [
    buildElement(`${ds}:RSAKeyValue`, {}, [
      buildTextElement(`${ds}:Modulus`, modulus),
      buildTextElement(`${ds}:Exponent`, exponent),
    ]),
  ])
}
