import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildContentObject } from './builders/buildContentObject'
import { buildSignature } from './builders/buildSignature'
import { formatDistinguishedName } from './formatters/formatDistinguishedName'
import { formatSignedXml } from './formatters/formatSignedXml'
import { computeReferenceDigest } from './mappers/computeReferenceDigest'
import { computeSignatureValue } from './mappers/computeSignatureValue'
import { contentReferenceSpec } from './mappers/contentReferenceSpec'
import { placeSignature } from './mappers/placeSignature'
import { resolveSignatureContext } from './mappers/resolveSignatureContext'
import { parseCertificateChain } from './parsers/parseCertificateChain'
import { parseOptionalXml } from './parsers/parseOptionalXml'
import type { SignXmlOptions } from './types/SignXmlOptions'
import type { SignXmlResult } from './types/SignXmlResult'

/**
 * Sign XML (or, enveloping and detached, any bytes) as XAdES-BES, or
 * XAdES-EPES with a policy: build the signature, place it, digest every
 * reference on the final tree, then sign the canonical SignedInfo.
 */
export const signXml = (
  identity: CertificateIdentity,
  bytes: Buffer,
  options: SignXmlOptions,
): SignXmlResult => {
  const content = {
    bytes,
    document: options.mode === 'detached' ? undefined : parseOptionalXml(bytes),
    signedNodeId: options.signedNodeId,
  }
  const certificates = parseCertificateChain(identity.cert)
  const context = resolveSignatureContext(certificates, options, content)
  const reference = contentReferenceSpec(
    options.mode,
    context,
    content,
    options.detachedUri,
  )
  const skeleton = buildSignature(
    context,
    reference,
    options.mode === 'enveloping'
      ? buildContentObject(context, content)
      : undefined,
  )
  const document = placeSignature(options.mode, content, skeleton.signature)
  for (const pending of skeleton.references)
    pending.digest.value = computeReferenceDigest(
      document,
      skeleton.signature,
      pending.target,
      context.referencesDigest,
    )
  skeleton.signatureValue.value = computeSignatureValue(
    identity,
    document,
    context,
  )
  return {
    xml: formatSignedXml(document),
    mode: options.mode,
    signatureId: context.ids.signature,
    signer: formatDistinguishedName(certificates.signer.subject),
  }
}
