import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { formatSignedXml } from './formatters/formatSignedXml'
import { selectTopLevelSignatures } from './selectors/selectTopLevelSignatures'
import type { XadesMultisignOptions } from './types/XadesMultisignOptions'
import { attachCounterSignature } from './writers/attachCounterSignature'

/**
 * Countersign every top-level XAdES signature (AutoFirma's `countersign`):
 * each gains a xades:CounterSignature over its SignatureValue; nothing
 * signed changes. shortcut: countersignatures already nested are not
 * countersigned in turn; walk them when a sede asks for it.
 */
export const countersignXadesSignature = (
  identity: CertificateIdentity,
  xml: Buffer,
  options: XadesMultisignOptions = {},
): Buffer => {
  const document = parseXmlDocument(xml)
  const targets = selectTopLevelSignatures(document.root)
  if (targets.length === 0) throw new Error('the XML carries no signature')
  for (const target of targets)
    attachCounterSignature(identity, document, target, options)
  return formatSignedXml(document)
}
