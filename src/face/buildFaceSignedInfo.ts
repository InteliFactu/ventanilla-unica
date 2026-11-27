import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import { xadesUris } from '../signing/xades/xadesUris'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import { faceSoapUris } from './faceSoapUris'

/** Bind the SOAP body to the WS-Security RSA signature. */
export const buildFaceSignedInfo = (
  id: string,
  bodyDigest: string,
  digest: 'sha1' | 'sha256',
): XmlElement =>
  buildElement('ds:SignedInfo', {}, [
    buildElement('ds:CanonicalizationMethod', {
      Algorithm: faceSoapUris.exclusive,
    }),
    buildElement('ds:SignatureMethod', { Algorithm: xadesUris.rsaSha1 }),
    buildElement('ds:Reference', { URI: `#${id}` }, [
      buildElement('ds:Transforms', {}, [
        buildElement('ds:Transform', { Algorithm: faceSoapUris.exclusive }),
      ]),
      buildElement('ds:DigestMethod', { Algorithm: xadesUris[digest] }),
      buildTextElement('ds:DigestValue', bodyDigest),
    ]),
  ])
