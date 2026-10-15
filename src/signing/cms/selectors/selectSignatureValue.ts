import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { selectSignerInfo } from './selectSignerInfo'

/** The signature octets of the first SignerInfo, what a signature timestamp stamps. */
export const selectSignatureValue = (cms: Buffer): Buffer => {
  const signature = readDerChildren(cms, selectSignerInfo(cms)).find(
    (field) => field.tag === 0x04,
  )
  if (!signature) throw new Error('the SignerInfo has no signature value')
  return Buffer.from(cms.subarray(signature.valueStart, signature.end))
}
