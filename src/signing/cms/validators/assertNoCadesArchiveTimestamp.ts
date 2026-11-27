import { derOid } from '../../asn1/derOid'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import { cmsOids } from '../cmsOids'
import { readCounterSignatureAttribute } from '../parsers/readCounterSignatureAttribute'
import { readSignerInfoParts } from '../parsers/readSignerInfoParts'

/** An archival timestamp may cover the unsigned data a countersignature changes. */
export const assertNoCadesArchiveTimestamp = (signerInfo: Buffer): void => {
  const archiveOids = [
    cmsOids.archiveTimeStamp,
    cmsOids.archiveTimeStampV2,
    cmsOids.archiveTimeStampV3,
  ]
  const { unsignedAttributes } = readSignerInfoParts(signerInfo)
  for (const attribute of unsignedAttributes) {
    const oid = readDerElement(
      attribute,
      readDerElement(attribute, 0).valueStart,
    )
    if (
      archiveOids.some((value) =>
        attribute.subarray(oid.start, oid.end).equals(derOid(value)),
      )
    )
      throw new Error(
        'CAdES countersigning does not support archive timestamps',
      )
    for (const child of readCounterSignatureAttribute(attribute) ?? [])
      assertNoCadesArchiveTimestamp(child)
  }
}
