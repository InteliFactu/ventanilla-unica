import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { baseNamespaceScope } from '../xml/mappers/baseNamespaceScope'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { formatSignedXml } from './formatters/formatSignedXml'
import { selectTopLevelXadesPaths } from './selectors/selectTopLevelXadesPaths'
import { selectXadesCountersignTargets } from './selectors/selectXadesCountersignTargets'
import type { XadesMultisignOptions } from './types/XadesMultisignOptions'
import { attachCounterSignature } from './writers/attachCounterSignature'

/**
 * Countersign the selected original XAdES signatures over their SignatureValue.
 * Direct calls without a target retain the top-level selection.
 */
export const countersignXadesSignature = (
  identity: CertificateIdentity,
  xml: Buffer,
  options: XadesMultisignOptions = {},
): Buffer => {
  const document = parseXmlDocument(xml)
  const targets = selectTopLevelXadesPaths(
    document.root,
    [],
    baseNamespaceScope(),
  ).flatMap((path) => selectXadesCountersignTargets(path, options.target))
  if (targets.length === 0) throw new Error('the XML carries no signature')
  for (const target of targets)
    attachCounterSignature(identity, document, target, options)
  return formatSignedXml(document)
}
