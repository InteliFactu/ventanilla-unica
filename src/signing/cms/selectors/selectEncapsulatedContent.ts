import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import type { DerElement } from '../../asn1/types/DerElement'

/**
 * The eContent octets of an EncapsulatedContentInfo, or undefined when the
 * signature is detached. shortcut: the eContent must be a primitive OCTET
 * STRING (DER, what AutoFirma and this project write); read constructed BER
 * octets when one arrives.
 */
export const selectEncapsulatedContent = (
  cms: Buffer,
  encapsulated: DerElement,
): Buffer | undefined => {
  const octets = readDerChildren(cms, encapsulated)
    .filter((field) => field.tag === 0xa0)
    .flatMap((explicit) => readDerChildren(cms, explicit))[0]
  if (octets === undefined) return undefined
  if (octets.tag !== 0x04)
    throw new Error('the CMS content is not a primitive OCTET STRING')
  return Buffer.from(cms.subarray(octets.valueStart, octets.end))
}
