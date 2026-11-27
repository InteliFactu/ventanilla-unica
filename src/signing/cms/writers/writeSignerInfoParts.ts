import { derSequence } from '../../asn1/derSequence'
import { derSetOf } from '../../asn1/derSetOf'
import type { CadesSignerInfoFields } from '../types/CadesSignerInfoFields'

/** Rebuild a SignerInfo around its byte-for-byte original signed fields. */
export const writeSignerInfoParts = (parts: CadesSignerInfoFields): Buffer =>
  derSequence([
    ...parts.signedFields,
    ...(parts.unsignedAttributes.length > 0
      ? [derSetOf(parts.unsignedAttributes, 0xa1)]
      : []),
  ])
