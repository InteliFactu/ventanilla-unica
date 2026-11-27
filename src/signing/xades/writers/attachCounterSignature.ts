import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { buildSignature } from '../builders/buildSignature'
import { resolveSignatureContext } from '../mappers/resolveSignatureContext'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import { selectXadesQualifyingPath } from '../selectors/selectXadesQualifyingPath'
import { selectXadesSignatureValueId } from '../selectors/selectXadesSignatureValueId'
import type { XadesMultisignOptions } from '../types/XadesMultisignOptions'
import { assertUniqueXadesReferenceIds } from '../validators/assertUniqueXadesReferenceIds'
import { xadesUris } from '../xadesUris'
import { appendUnsignedSignatureProperty } from './appendUnsignedSignatureProperty'
import { completeSignature } from './completeSignature'

/** Countersign one signature of `document` in place: a xades:CounterSignature over its SignatureValue, as AutoFirma writes it. */
export const attachCounterSignature = (
  identity: CertificateIdentity,
  document: XmlDocument,
  target: readonly XmlElement[],
  options: XadesMultisignOptions,
): void => {
  const valueId = selectXadesSignatureValueId(target)
  const qualifying = selectXadesQualifyingPath(target)
  const context = resolveSignatureContext(
    parseCertificateChain(identity.cert),
    { mimeType: 'text/xml', ...options, mode: 'enveloped' },
    { bytes: Buffer.alloc(0), document: undefined },
  )
  const skeleton = buildSignature(context, {
    id: context.ids.reference,
    type: xadesUris.countersignedSignatureType,
    uri: `#${valueId}`,
    transforms: [xadesUris.c14n],
    target: { kind: 'id', id: valueId },
  })
  appendUnsignedSignatureProperty(qualifying, skeleton.signature)
  assertUniqueXadesReferenceIds(document.root, skeleton.references)
  completeSignature(identity, document, skeleton, context)
}
