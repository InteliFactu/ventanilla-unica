import { buildElement } from '../signing/xades/builders/buildElement'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import { faceSoapUris } from './faceSoapUris'

/** Point the signature's KeyInfo to the certificate token in this header. */
export const buildFaceBinaryKeyInfo = (id: string): XmlElement =>
  buildElement('ds:KeyInfo', {}, [
    buildElement('wsse:SecurityTokenReference', {}, [
      buildElement('wsse:Reference', {
        URI: `#${id}`,
        ValueType: faceSoapUris.x509,
      }),
    ]),
  ])
