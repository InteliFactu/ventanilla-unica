import { textXmlObjectIdentifier } from '../textXmlObjectIdentifier'
import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import type { SignerCertificate } from '../types/SignerCertificate'
import type { SignXmlOptions } from '../types/SignXmlOptions'
import { xadesUris } from '../xadesUris'
import { resolveSignatureProfile } from './resolveSignatureProfile'
import { resolveXadesIds } from './resolveXadesIds'

/**
 * Apply the documented defaults to the caller's options; XML content is named
 * by its OID in DataObjectFormat, as AutoFirma does.
 */
export const resolveSignatureContext = (
  certificates: SignerCertificate,
  options: SignXmlOptions,
  content: SignedContent,
): SignatureContext => {
  const wrapped =
    (options.mode === 'enveloping' || options.mode === 'internally-detached') &&
    content.document === undefined
  const mimeType =
    options.mimeType ??
    (content.document === undefined ? 'application/octet-stream' : 'text/xml')
  return {
    ...resolveSignatureProfile(options),
    objectIdentifier:
      options.objectIdentifier ??
      (mimeType === 'text/xml' ? textXmlObjectIdentifier : undefined),
    certificates,
    prefixes: { ds: 'ds', xades: 'xades', ...options.prefixes },
    ids: resolveXadesIds(options.ids),
    keyInfo: {
      chain: true,
      keyValue: false,
      reference: true,
      ...options.keyInfo,
    },
    signingCertificateVersion: options.signingCertificateVersion ?? 1,
    policy: options.policy,
    signingTime: options.signingTime ?? new Date(),
    mimeType,
    encoding: wrapped ? xadesUris.base64 : undefined,
  }
}
