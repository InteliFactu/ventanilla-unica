import type { DigestName } from '../../types/DigestName'
import { canonicalizeDocument } from '../../xml/mappers/canonicalizeDocument'
import { canonicalizeSubtree } from '../../xml/mappers/canonicalizeSubtree'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { selectPathById } from '../selectors/selectPathById'
import { selectPathBySignedNodeId } from '../selectors/selectPathBySignedNodeId'
import type { ReferenceTarget } from '../types/ReferenceTarget'
import { digestBase64 } from './digestBase64'

/**
 * The DigestValue of a reference, computed on the final tree: the
 * whole document minus the signature (enveloped), the signed node minus the
 * signature (enveloped by node), the inclusive C14N of an
 * element in its document context (`#id`), or raw bytes.
 */
export const computeReferenceDigest = (
  document: XmlDocument,
  signature: XmlElement,
  target: ReferenceTarget,
  digest: DigestName,
): string => {
  if (target.kind === 'bytes') return digestBase64(digest, target.data)
  if (target.kind === 'enveloped' && target.node !== undefined)
    return digestBase64(
      digest,
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
    return digestBase64(
      digest,
      canonicalizeDocument(document, {
        withComments: false,
        exclusive: false,
        exclude: signature,
      }),
    )
  return digestBase64(
    digest,
    canonicalizeSubtree(selectPathById(document.root, target.id), {
      withComments: false,
      exclusive: false,
    }),
  )
}
