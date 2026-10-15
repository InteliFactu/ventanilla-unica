import { derOid } from '../../asn1/derOid'
import { cmsOids } from '../cmsOids'
import type { SignedDataParts } from '../types/SignedDataParts'

/**
 * The content a cosignature signs: the CMS's own when implicit (a given one
 * must match it), the given one when detached. Only id-data content is
 * cosigned, since the new signer claims contentType data.
 */
export const validateCosignContent = (
  parts: SignedDataParts,
  given: Buffer | undefined,
): Buffer => {
  if (!parts.encapsulated.includes(derOid(cmsOids.data)))
    throw new Error('only CMS over id-data content can be cosigned')
  const content = parts.content ?? given
  if (content === undefined)
    throw new Error('a detached CMS needs the signed content to cosign it')
  if (given !== undefined && !content.equals(given))
    throw new Error('the content given is not the content the CMS carries')
  return content
}
