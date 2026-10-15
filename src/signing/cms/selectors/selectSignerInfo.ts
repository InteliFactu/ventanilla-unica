import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { DerElement } from '../../asn1/types/DerElement'

/** The first SignerInfo of a ContentInfo-wrapped SignedData. */
export const selectSignerInfo = (cms: Buffer): DerElement => {
  const [, wrapper] = readDerChildren(cms, readDerElement(cms, 0))
  const signedData = wrapper && readDerChildren(cms, wrapper)[0]
  const signerSet = signedData && readDerChildren(cms, signedData).at(-1)
  const signer = signerSet && readDerChildren(cms, signerSet)[0]
  if (signer?.tag !== 0x30) throw new Error('the CMS carries no SignerInfo')
  return signer
}
