import { buildElement } from '../signing/xades/builders/buildElement'
import { buildTextElement } from '../signing/xades/builders/buildTextElement'
import { xadesUris } from '../signing/xades/xadesUris'
import type { XmlElement } from '../signing/xml/types/XmlElement'
import { legacyFaceUris } from './legacyFaceUris'

/** Match the signing algorithms of the archived WS-Security client. */
export const buildLegacyFaceSignedInfo = (
  id: string,
  bodyDigest: string,
): XmlElement =>
  buildElement('ds:SignedInfo', {}, [
    buildElement('ds:CanonicalizationMethod', {
      Algorithm: legacyFaceUris.exclusive,
    }),
    buildElement('ds:SignatureMethod', { Algorithm: xadesUris.rsaSha1 }),
    buildElement('ds:Reference', { URI: `#${id}` }, [
      buildElement('ds:Transforms', {}, [
        buildElement('ds:Transform', { Algorithm: legacyFaceUris.exclusive }),
      ]),
      buildElement('ds:DigestMethod', { Algorithm: xadesUris.sha1 }),
      buildTextElement('ds:DigestValue', bodyDigest),
    ]),
  ])
