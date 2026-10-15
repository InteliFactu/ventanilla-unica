import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { DerElement } from '../../asn1/types/DerElement'
import { selectEncapsulatedContent } from '../selectors/selectEncapsulatedContent'
import type { SignedDataParts } from '../types/SignedDataParts'

/** Split a ContentInfo-wrapped SignedData into its fields. */
export const readSignedDataParts = (cms: Buffer): SignedDataParts => {
  const raw = (element: DerElement): Buffer =>
    Buffer.from(cms.subarray(element.start, element.end))
  const [, wrapper] = readDerChildren(cms, readDerElement(cms, 0))
  const signedData = wrapper && readDerChildren(cms, wrapper)[0]
  const fields = signedData ? readDerChildren(cms, signedData) : []
  const [version, algorithms, encapsulated] = fields
  const signers = fields.at(-1)
  if (!version || !algorithms || !encapsulated || signers?.tag !== 0x31)
    throw new Error('not a CMS SignedData')
  const tagged = (tag: number): DerElement | undefined =>
    fields.slice(3, -1).find((field) => field.tag === tag)
  const certificates = tagged(0xa0)
  const crls = tagged(0xa1)
  return {
    version: raw(version),
    digestAlgorithms: readDerChildren(cms, algorithms).map(raw),
    encapsulated: raw(encapsulated),
    content: selectEncapsulatedContent(cms, encapsulated),
    certificates: certificates
      ? readDerChildren(cms, certificates).map(raw)
      : [],
    crls: crls && raw(crls),
    signerInfos: readDerChildren(cms, signers).map(raw),
  }
}
