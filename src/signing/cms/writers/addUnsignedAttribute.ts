import { derSequence } from '../../asn1/derSequence'
import { derSetOf } from '../../asn1/derSetOf'
import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { DerElement } from '../../asn1/types/DerElement'

/** One encoded SignerInfo with `attribute` added to its unsignedAttrs, created or merged; nothing signed changes. */
export const addUnsignedAttribute = (
  signerInfo: Buffer,
  attribute: Buffer,
): Buffer => {
  const fields = readDerChildren(signerInfo, readDerElement(signerInfo, 0))
  const signed = fields.filter((field) => field.tag !== 0xa1)
  const unsigned = fields.find((field) => field.tag === 0xa1)
  const existing = unsigned ? readDerChildren(signerInfo, unsigned) : []
  const raw = (field: DerElement): Buffer =>
    signerInfo.subarray(field.start, field.end)
  return derSequence([
    ...signed.map(raw),
    derSetOf([...existing.map(raw), attribute], 0xa1),
  ])
}
