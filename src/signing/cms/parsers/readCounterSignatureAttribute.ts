import { derOid } from '../../asn1/derOid'
import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import { cmsOids } from '../cmsOids'

/** Read every original countersigner in a CMS counterSignature attribute. */
export const readCounterSignatureAttribute = (
  attribute: Buffer,
): readonly Buffer[] | undefined => {
  const [oid, values, extra] = readDerChildren(
    attribute,
    readDerElement(attribute, 0),
  )
  if (
    !oid ||
    !attribute
      .subarray(oid.start, oid.end)
      .equals(derOid(cmsOids.countersignature))
  )
    return undefined
  if (
    values?.tag !== 0x31 ||
    extra !== undefined ||
    values.valueStart === values.end
  )
    throw new Error('invalid CMS counterSignature attribute')
  const signers = attribute.subarray(values.start, values.end)
  return readDerChildren(signers, readDerElement(signers, 0)).map(
    ({ start, end }) => signers.subarray(start, end),
  )
}
