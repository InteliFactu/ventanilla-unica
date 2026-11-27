import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { CadesSignerInfoFields } from '../types/CadesSignerInfoFields'

/** Separate an encoded SignerInfo's unsigned attributes from its unchanged fields. */
export const readSignerInfoParts = (
  signerInfo: Buffer,
): CadesSignerInfoFields => {
  const sequence = readDerElement(signerInfo, 0)
  if (sequence.tag !== 0x30 || sequence.end !== signerInfo.length)
    throw new Error('invalid CMS SignerInfo')
  const fields = readDerChildren(signerInfo, sequence)
  const tail = fields.at(-1)
  const unsigned = tail?.tag === 0xa1 ? tail : undefined
  const signedFields = (unsigned ? fields.slice(0, -1) : fields).map(
    ({ start, end }) => signerInfo.subarray(start, end),
  )
  if (!unsigned) return { signedFields, unsignedAttributes: [] }
  const attributes = signerInfo.subarray(unsigned.start, unsigned.end)
  return {
    signedFields,
    unsignedAttributes: readDerChildren(
      attributes,
      readDerElement(attributes, 0),
    ).map(({ start, end }) => attributes.subarray(start, end)),
  }
}
