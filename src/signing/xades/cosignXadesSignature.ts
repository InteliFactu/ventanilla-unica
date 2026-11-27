import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { formatSignedXml } from './formatters/formatSignedXml'
import { readEnvelopingContent } from './parsers/readEnvelopingContent'
import { selectDetachedCosignature } from './selectors/selectDetachedCosignature'
import { selectTopLevelSignatures } from './selectors/selectTopLevelSignatures'
import { signXml } from './signXml'
import type { XadesMultisignOptions } from './types/XadesMultisignOptions'
import { assertDetachedCosignatureSiblings } from './validators/assertDetachedCosignatureSiblings'
import { isSignatureElement } from './validators/isSignatureElement'
import { appendCosignatureSibling } from './writers/appendCosignatureSibling'
import { appendDetachedCosignature } from './writers/appendDetachedCosignature'

/**
 * Add the holder's XAdES signature over the same content (AutoFirma's
 * `cosign`). Enveloped: a second ds:Signature in the root, whose XPath filter
 * leaves the first one out. Enveloping: a new enveloping signature of the
 * same content beside the old one under an `AFIRMA` root. For detached
 * signatures the new signature references the original data URI.
 */
export const cosignXadesSignature = (
  identity: CertificateIdentity,
  xml: Buffer,
  options: XadesMultisignOptions = {},
): Buffer => {
  const document = parseXmlDocument(xml)
  const [first, ...others] = selectTopLevelSignatures(document.root)
  if (first === undefined) throw new Error('the XML carries no signature')
  const detached = selectDetachedCosignature(document.root, first)
  if (detached !== undefined) {
    assertDetachedCosignatureSiblings(document.root, detached, others)
    appendDetachedCosignature(identity, document, detached, options)
    return formatSignedXml(document)
  }
  const wrapped = document.root.name === 'AFIRMA'
  if (!wrapped && !isSignatureElement(document.root))
    return signXml(identity, xml, { ...options, mode: 'enveloped' }).xml
  if (
    wrapped &&
    !document.root.children.every(
      (child) => child.kind !== 'element' || isSignatureElement(child),
    )
  )
    throw new Error('unrecognized XAdES cosignature placement')
  const added = parseXmlDocument(
    signXml(identity, readEnvelopingContent(first), {
      ...options,
      mode: 'enveloping',
    }).xml,
  ).root
  appendCosignatureSibling(document, wrapped ? document.root : undefined, added)
  return formatSignedXml(document)
}
