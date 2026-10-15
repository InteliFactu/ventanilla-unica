import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { XmlDocument } from '../../xml/types/XmlDocument'
import type { XmlElement } from '../../xml/types/XmlElement'
import { buildElement } from '../builders/buildElement'
import { buildSignature } from '../builders/buildSignature'
import { qualifiedNameLike } from '../mappers/qualifiedNameLike'
import { resolveSignatureContext } from '../mappers/resolveSignatureContext'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import { selectElementByLocalName } from '../selectors/selectElementByLocalName'
import { selectIdOf } from '../selectors/selectIdOf'
import type { XadesMultisignOptions } from '../types/XadesMultisignOptions'
import { xadesUris } from '../xadesUris'
import { appendUnsignedSignatureProperty } from './appendUnsignedSignatureProperty'
import { completeSignature } from './completeSignature'

/** Countersign one signature of `document` in place: a xades:CounterSignature over its SignatureValue, as AutoFirma writes it. */
export const attachCounterSignature = (
  identity: CertificateIdentity,
  document: XmlDocument,
  target: XmlElement,
  options: XadesMultisignOptions,
): void => {
  const valueId = selectIdOf(
    selectElementByLocalName(target, 'SignatureValue').at(-1),
  )
  const qualifying = selectElementByLocalName(target, 'QualifyingProperties')
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
  const holder = qualifying.at(-1)
  if (holder === undefined)
    throw new Error('the signature has no QualifyingProperties')
  appendUnsignedSignatureProperty(
    holder,
    buildElement(qualifiedNameLike(holder, 'CounterSignature'), {}, [
      skeleton.signature,
    ]),
  )
  completeSignature(identity, document, skeleton, context)
}
