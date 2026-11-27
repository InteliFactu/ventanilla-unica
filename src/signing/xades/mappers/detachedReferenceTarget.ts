import type { XmlElement } from '../../xml/types/XmlElement'
import { readDetachedBase64Content } from '../parsers/readDetachedBase64Content'
import type { ReferenceTarget } from '../types/ReferenceTarget'
import { xadesUris } from '../xadesUris'

/** The only detached transforms this signer can evaluate without resolving a URI. */
export const detachedReferenceTarget = (
  contentPath: readonly XmlElement[] | undefined,
  transforms: readonly string[],
  original: Buffer | undefined,
): ReferenceTarget => {
  if (transforms.length > 1)
    throw new Error('unsupported detached XAdES reference transforms')
  const [transform] = transforms
  if (contentPath === undefined) {
    if (transform !== undefined)
      throw new Error('unsupported detached XAdES reference transforms')
    if (original === undefined)
      throw new Error('XAdES cosigning needs the original detached data')
    return { kind: 'bytes', data: original }
  }
  if (transform === undefined || transform === xadesUris.c14n)
    return { kind: 'subtree', path: contentPath }
  const element = contentPath.at(-1)
  if (transform !== xadesUris.base64 || element === undefined)
    throw new Error('unsupported detached XAdES reference transforms')
  return { kind: 'bytes', data: readDetachedBase64Content(element) }
}
