import type { KeyInfoOptions } from './KeyInfoOptions'
import type { SignaturePolicy } from './SignaturePolicy'
import type { SignatureProfile } from './SignatureProfile'
import type { SignerCertificate } from './SignerCertificate'
import type { SigningCertificateVersion } from './SigningCertificateVersion'
import type { XadesIds } from './XadesIds'
import type { XadesPrefixes } from './XadesPrefixes'

/** Every resolved input the signature builders need. */
export type SignatureContext = SignatureProfile & {
  readonly certificates: SignerCertificate
  readonly prefixes: XadesPrefixes
  readonly ids: XadesIds
  readonly keyInfo: KeyInfoOptions
  readonly signingCertificateVersion: SigningCertificateVersion
  readonly policy: SignaturePolicy | undefined
  readonly signingTime: Date
  readonly mimeType: string
  /** DataObjectFormat Encoding, for base64-wrapped content. */
  readonly encoding: string | undefined
}
