import { postTimestampQuery } from '../tsp/fetchers/postTimestampQuery'
import { requestTimestampToken } from '../tsp/requestTimestampToken'
import type { TimestampAuthority } from '../tsp/types/TimestampAuthority'
import type { TimestampPost } from '../tsp/types/TimestampPost'
import { canonicalizeSubtree } from '../xml/mappers/canonicalizeSubtree'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import type { XmlElement } from '../xml/types/XmlElement'
import { buildUnsignedProperties } from './builders/buildUnsignedProperties'
import { formatSignedXml } from './formatters/formatSignedXml'
import { selectElementByLocalName } from './selectors/selectElementByLocalName'
import { validateNoUnsignedProperties } from './validators/validateNoUnsignedProperties'

/**
 * Turn the XAdES-B signature `signXml` wrote into XAdES-T: ask the TSA to
 * stamp the C14N of ds:SignatureValue and append UnsignedProperties with the
 * token to QualifyingProperties. Nothing signed changes.
 */
export const timestampXadesSignature = async (
  xml: Buffer,
  authority: TimestampAuthority,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const document = parseXmlDocument(xml)
  const value = selectElementByLocalName(document.root, 'SignatureValue')
  const qualifying = selectElementByLocalName(
    document.root,
    'QualifyingProperties',
  )
  validateNoUnsignedProperties(qualifying)
  const canonical = canonicalizeSubtree(value, {
    withComments: false,
    exclusive: false,
  })
  const token = await requestTimestampToken(
    Buffer.from(canonical),
    authority,
    post,
  )
  const prefix = (path: readonly XmlElement[]): string =>
    path.at(-1)?.name.split(':')[0] ?? ''
  qualifying
    .at(-1)
    ?.children.push(
      buildUnsignedProperties(prefix(qualifying), prefix(value), token),
    )
  return formatSignedXml(document)
}
