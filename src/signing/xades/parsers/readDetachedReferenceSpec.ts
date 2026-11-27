import { selectXmlAttributeValue } from '../../xml/selectors/selectXmlAttributeValue'
import type { XmlElement } from '../../xml/types/XmlElement'
import { detachedReferenceTarget } from '../mappers/detachedReferenceTarget'
import { selectDirectElementPaths } from '../selectors/selectDirectElementPaths'
import type { DetachedCosignature } from '../types/DetachedCosignature'
import type { ReferenceSpec } from '../types/ReferenceSpec'
import { xadesUris } from '../xadesUris'

/** Carry the signed data URI, type and supported transforms into the co-signature. */
export const readDetachedReferenceSpec = (
  { referencePath, contentPath }: DetachedCosignature,
  original: Buffer | undefined,
): ReferenceSpec => {
  const reference = referencePath.at(-1)
  const uri = selectXmlAttributeValue(reference, 'URI')
  const type = selectXmlAttributeValue(reference, 'Type')
  if (!uri || (type !== undefined && type !== xadesUris.objectType))
    throw new Error('unsupported detached XAdES reference type')
  const containers = selectDirectElementPaths(
    referencePath,
    'Transforms',
    xadesUris.ds,
  )
  const transforms = containers.flatMap((path) =>
    selectDirectElementPaths(path, 'Transform', xadesUris.ds).map(
      (transform) => {
        const node: XmlElement | undefined = transform.at(-1)
        if (node?.children.some(({ kind }) => kind === 'element'))
          throw new Error('unsupported detached XAdES reference transforms')
        return selectXmlAttributeValue(node, 'Algorithm') ?? ''
      },
    ),
  )
  return {
    uri,
    type,
    transforms,
    target: detachedReferenceTarget(contentPath, transforms, original),
  }
}
