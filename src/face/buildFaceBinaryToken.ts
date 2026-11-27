import type { X509Certificate } from 'node:crypto'

import { buildElement } from '../signing/xades/builders/buildElement'
import { buildText } from '../signing/xades/builders/buildText'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import { faceSoapUris } from './faceSoapUris'

/** Carry the public signing certificate as WS-Security X.509v3 DER. */
export const buildFaceBinaryToken = (
  certificate: X509Certificate,
  id: string,
): XmlElement =>
  buildElement(
    'wsse:BinarySecurityToken',
    {
      'wsu:Id': id,
      EncodingType: faceSoapUris.base64Binary,
      ValueType: faceSoapUris.x509,
    },
    [buildText(certificate.raw.toString('base64'))],
  )
