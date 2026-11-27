import type { CountersignTarget } from '../../types/CountersignTarget'
import { cmsAttribute } from '../cmsAttribute'
import { cmsOids } from '../cmsOids'
import { readCounterSignatureAttribute } from '../parsers/readCounterSignatureAttribute'
import { readSignerInfoParts } from '../parsers/readSignerInfoParts'
import { writeSignerInfoParts } from './writeSignerInfoParts'

/** Rewrite original descendants first, then append a countersignature if this node was selected. */
export const countersignCadesSignerTree = (
  signerInfo: Buffer,
  target: CountersignTarget,
  sign: (original: Buffer) => Buffer,
): Buffer => {
  const { signedFields, unsignedAttributes } = readSignerInfoParts(signerInfo)
  const rewritten: Buffer[] = []
  let hasChildren = false
  for (const attribute of unsignedAttributes) {
    const children = readCounterSignatureAttribute(attribute)
    if (children === undefined) {
      rewritten.push(attribute)
      continue
    }
    hasChildren = true
    rewritten.push(
      cmsAttribute(
        cmsOids.countersignature,
        children.map((child) =>
          countersignCadesSignerTree(child, target, sign),
        ),
      ),
    )
  }
  if (target === 'tree' || !hasChildren)
    rewritten.push(cmsAttribute(cmsOids.countersignature, [sign(signerInfo)]))
  return writeSignerInfoParts({ signedFields, unsignedAttributes: rewritten })
}
