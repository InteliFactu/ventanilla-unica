import { randomUUID } from 'node:crypto'

import type { XadesIds } from '../types/XadesIds'

/**
 * Every Id, AutoFirma style: `Signature-<uuid>` and its `-SignedInfo`,
 * `-SignatureValue`, `-KeyInfo`, `-SignedProperties`, `-QualifyingProperties`
 * and `-Object` suffixes, plus `Reference-<uuid>`, and the `AFIRMA-Root-<uuid>`
 * and `CONTENT-<uuid>` of an internally detached signature; any of them
 * overridable.
 */
export const resolveXadesIds = (
  overrides: Partial<XadesIds> = {},
): XadesIds => {
  const signature = overrides.signature ?? `Signature-${randomUUID()}`
  return {
    signature,
    signedInfo: `${signature}-SignedInfo`,
    signatureValue: `${signature}-SignatureValue`,
    keyInfo: `${signature}-KeyInfo`,
    signedProperties: `${signature}-SignedProperties`,
    qualifyingProperties: `${signature}-QualifyingProperties`,
    reference: `Reference-${randomUUID()}`,
    object: `${signature}-Object`,
    detachedRoot: `AFIRMA-Root-${randomUUID()}`,
    detachedContent: `CONTENT-${randomUUID()}`,
    ...overrides,
  }
}
