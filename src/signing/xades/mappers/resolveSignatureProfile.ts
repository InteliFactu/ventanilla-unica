import type { SignatureProfile } from '../types/SignatureProfile'
import type { SignXmlOptions } from '../types/SignXmlOptions'

/** The profile options with their documented defaults applied. */
export const resolveSignatureProfile = (
  options: SignXmlOptions,
): SignatureProfile => ({
  signatureDigest: options.signatureDigest ?? 'sha256',
  referencesDigest: options.referencesDigest ?? 'sha256',
  signerRoles: options.signerRoles ?? [],
  contentC14nTransform: options.contentC14nTransform ?? true,
  objectIdentifier: options.objectIdentifier,
})
