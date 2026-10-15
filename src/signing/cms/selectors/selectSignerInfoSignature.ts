import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'

/** The signature octets of one encoded SignerInfo. */
export const selectSignerInfoSignature = (signerInfo: Buffer): Buffer => {
  const signature = readDerChildren(
    signerInfo,
    readDerElement(signerInfo, 0),
  ).find((field) => field.tag === 0x04)
  if (!signature) throw new Error('the SignerInfo has no signature value')
  return Buffer.from(signerInfo.subarray(signature.valueStart, signature.end))
}
