import type { SignatureContext } from '../types/SignatureContext'
import type { SignedContent } from '../types/SignedContent'
import type { SignerCertificate } from '../types/SignerCertificate'
import type { SignXmlOptions } from '../types/SignXmlOptions'
import { xadesUris } from '../xadesUris'
import { resolveSignatureProfile } from './resolveSignatureProfile'
import { resolveXadesIds } from './resolveXadesIds'

/** Apply the documented defaults to the caller's options. */
export const resolveSignatureContext = (
  certificates: SignerCertificate,
  options: SignXmlOptions,
  content: SignedContent,
): SignatureContext => {
  const wrapped =
    (options.mode === 'enveloping' || options.mode === 'internally-detached') &&
    content.document === undefined
  return {
    ...resolveSignatureProfile(options),
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
    mimeType:
      options.mimeType ??
      (content.document === undefined
        ? 'application/octet-stream'
        : 'text/xml'),
    encoding: wrapped ? xadesUris.base64 : undefined,
  }
}
