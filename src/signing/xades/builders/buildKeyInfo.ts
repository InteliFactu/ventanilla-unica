import { selectSigningKeyType } from '../../selectors/selectSigningKeyType'
import type { XmlElement } from '../../xml/types/XmlElement'
import type { SignatureContext } from '../types/SignatureContext'
import { buildElement } from './buildElement'
import { buildKeyValue } from './buildKeyValue'
import { buildTextElement } from './buildTextElement'

/**
 * ds:KeyInfo: X509Data with the signer (and chain), optionally its
 * RSAKeyValue; an EC key gets no KeyValue, as in AutoFirma.
 */
export const buildKeyInfo = (context: SignatureContext): XmlElement => {
  const { ds } = context.prefixes
  const { signer, chain } = context.certificates
  const certificates = (context.keyInfo.chain ? chain : [signer]).map(
    (certificate) =>
      buildTextElement(
        `${ds}:X509Certificate`,
        certificate.raw.toString('base64'),
      ),
  )
  return buildElement(`${ds}:KeyInfo`, { Id: context.ids.keyInfo }, [
    buildElement(`${ds}:X509Data`, {}, certificates),
    ...(context.keyInfo.keyValue && selectSigningKeyType(signer) === 'rsa'
      ? [buildKeyValue(ds, signer)]
      : []),
  ])
}
