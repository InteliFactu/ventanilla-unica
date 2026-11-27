import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { detachedReferenceDigests } from '../detachedReferenceDigests'
import { computeReferenceDigest } from '../mappers/computeReferenceDigest'
import { selectDirectElementPaths } from '../selectors/selectDirectElementPaths'
import type { ReferenceTarget } from '../types/ReferenceTarget'
import { xadesUris } from '../xadesUris'

/** Compare the selected content against the original reference before signing it. */
export const assertDetachedReferenceMatches = (
  document: XmlDocument,
  signature: XmlElement,
  referencePath: readonly XmlElement[],
  target: ReferenceTarget,
): void => {
  const [method] = selectDirectElementPaths(
    referencePath,
    'DigestMethod',
    xadesUris.ds,
  )
  const algorithm = method
    ?.at(-1)
    ?.attributes.find(({ name }) => name === 'Algorithm')?.value
  const digest = detachedReferenceDigests.get(algorithm ?? '')
  if (digest === undefined)
    throw new Error('unsupported original detached XAdES digest algorithm')
  const [value] = selectDirectElementPaths(
    referencePath,
    'DigestValue',
    xadesUris.ds,
  )
  const expected = value
    ?.at(-1)
    ?.children.map((child) => (child.kind === 'text' ? child.value : ''))
    .join('')
    .replace(/\s/gu, '')
  if (computeReferenceDigest(document, signature, target, digest) !== expected)
    throw new Error('data does not match the original XAdES reference')
}
