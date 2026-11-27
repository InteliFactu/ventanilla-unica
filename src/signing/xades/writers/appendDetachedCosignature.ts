import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import { buildSignature } from '../builders/buildSignature'
import { resolveSignatureContext } from '../mappers/resolveSignatureContext'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import { readDetachedReferenceSpec } from '../parsers/readDetachedReferenceSpec'
import { selectUniqueDetachedContentPath } from '../selectors/selectUniqueDetachedContentPath'
import type { DetachedCosignature } from '../types/DetachedCosignature'
import type { XadesMultisignOptions } from '../types/XadesMultisignOptions'
import { assertDetachedReferenceMatches } from '../validators/assertDetachedReferenceMatches'
import { assertUniqueXadesReferenceIds } from '../validators/assertUniqueXadesReferenceIds'
import { appendCosignatureSibling } from './appendCosignatureSibling'
import { completeSignature } from './completeSignature'

/** Sign the existing detached data reference inside the original XML context. */
export const appendDetachedCosignature = (
  identity: CertificateIdentity,
  document: XmlDocument,
  detached: DetachedCosignature,
  options: XadesMultisignOptions,
): void => {
  const reference = readDetachedReferenceSpec(detached, options.detachedContent)
  assertDetachedReferenceMatches(
    document,
    detached.signature,
    detached.referencePath,
    reference.target,
  )
  const mode =
    detached.contentPath === undefined ? 'detached' : 'internally-detached'
  const context = resolveSignatureContext(
    parseCertificateChain(identity.cert),
    { ...options, mode },
    {
      bytes:
        reference.target.kind === 'bytes'
          ? reference.target.data
          : Buffer.alloc(0),
      document: reference.target.kind === 'subtree' ? document : undefined,
    },
  )
  const skeleton = buildSignature(context, {
    ...reference,
    id: context.ids.reference,
  })
  appendCosignatureSibling(document, detached.parent, skeleton.signature)
  if (detached.contentPath !== undefined)
    selectUniqueDetachedContentPath(document.root, reference.uri.slice(1))
  assertUniqueXadesReferenceIds(document.root, skeleton.references)
  completeSignature(identity, document, skeleton, context)
}
