import type { X509Certificate } from 'node:crypto'

import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import { formatDistinguishedName } from '../signing/xades/formatters/formatDistinguishedName'
import type { XmlElement } from '../signing/xml/types/XmlElement'

/** Embed the public signer in the legacy WS-Security X.509 token reference. */
export const buildFaceSecurityKeyInfo = (signer: X509Certificate): XmlElement =>
  buildElement('ds:KeyInfo', {}, [
    buildElement('wsse:SecurityTokenReference', {}, [
      buildElement('ds:X509Data', {}, [
        buildElement('ds:X509IssuerSerial', {}, [
          buildTextElement(
            'ds:X509IssuerName',
            formatDistinguishedName(signer.issuer),
          ),
          buildTextElement(
            'ds:X509SerialNumber',
            BigInt(`0x${signer.serialNumber}`).toString(),
          ),
        ]),
        buildTextElement('ds:X509Certificate', signer.raw.toString('base64')),
      ]),
    ]),
  ])
