import { canonicalizeDocument } from '../../xml/mappers/canonicalizeDocument'
import { canonicalizeSubtree } from '../../xml/mappers/canonicalizeSubtree'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { selectPathById } from '../selectors/selectPathById'
import { selectPathBySignedNodeId } from '../selectors/selectPathBySignedNodeId'
import type { ReferenceTarget } from '../types/ReferenceTarget'
import { sha256Base64 } from './sha256Base64'

/**
 * The SHA-256 DigestValue of a reference, computed on the final tree: the
 * whole document minus the signature (enveloped), the signed node minus the
 * signature (enveloped by node), the inclusive C14N of an
 * element in its document context (`#id`), or raw bytes.
 */
export const computeReferenceDigest = (
  document: XmlDocument,
  signature: XmlElement,
  target: ReferenceTarget,
): string => {
  if (target.kind === 'bytes') return sha256Base64(target.data)
  if (target.kind === 'enveloped' && target.node !== undefined)
    return sha256Base64(
      canonicalizeSubtree(
        selectPathBySignedNodeId(document.root, target.node),
        {
          withComments: false,
          exclusive: false,
          exclude: signature,
        },
      ),
    )
  if (target.kind === 'enveloped')
    return sha256Base64(
      canonicalizeDocument(document, {
        withComments: false,
        exclusive: false,
        exclude: signature,
      }),
    )
  return sha256Base64(
    canonicalizeSubtree(selectPathById(document.root, target.id), {
      withComments: false,
      exclusive: false,
    }),
  )
}
