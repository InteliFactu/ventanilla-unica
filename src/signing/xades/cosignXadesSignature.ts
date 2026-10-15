import { randomUUID } from 'node:crypto'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { buildElement } from './builders/buildElement'
import { formatSignedXml } from './formatters/formatSignedXml'
import { readEnvelopingContent } from './parsers/readEnvelopingContent'
import { selectTopLevelSignatures } from './selectors/selectTopLevelSignatures'
import { signXml } from './signXml'
import type { XadesMultisignOptions } from './types/XadesMultisignOptions'
import { isSignatureElement } from './validators/isSignatureElement'

/**
 * Add the holder's XAdES signature over the same content (AutoFirma's
 * `cosign`). Enveloped: a second ds:Signature in the root, whose XPath filter
 * leaves the first one out. Enveloping: a new enveloping signature of the
 * same content beside the old one under an `AFIRMA` root. shortcut:
 * detached and internally detached signatures are refused until a sede
 * needs them.
 */
export const cosignXadesSignature = (
  identity: CertificateIdentity,
  xml: Buffer,
  options: XadesMultisignOptions = {},
): Buffer => {
  const document = parseXmlDocument(xml)
  const [first] = selectTopLevelSignatures(document.root)
  if (first === undefined) throw new Error('the XML carries no signature')
  const wrapped = document.root.name === 'AFIRMA'
  if (!wrapped && !isSignatureElement(document.root))
    return signXml(identity, xml, { ...options, mode: 'enveloped' }).xml
  if (
    wrapped &&
    !document.root.children.every(
      (child) => child.kind !== 'element' || isSignatureElement(child),
    )
  )
    throw new Error('only enveloped and enveloping XAdES can be cosigned')
  const added = parseXmlDocument(
    signXml(identity, readEnvelopingContent(first), {
      ...options,
      mode: 'enveloping',
    }).xml,
  ).root
  if (wrapped) document.root.children.push(added)
  else
    document.root = buildElement(
      'AFIRMA',
      { Id: `AfirmaRoot-${randomUUID()}` },
      [document.root, added],
    )
  return formatSignedXml(document)
}
