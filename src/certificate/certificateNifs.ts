import { X509Certificate } from 'node:crypto'

import { subjectNifs } from './parsers/subjectNifs'
import type { CertificateIdentity } from './types/CertificateIdentity'

/** The NIFs the identity's certificate is issued to or on behalf of. */
export const certificateNifs = (identity: CertificateIdentity): string[] =>
  subjectNifs(new X509Certificate(identity.cert).subject)
