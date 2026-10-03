import { rootCertificates } from 'node:tls'

import { fnmtServerIntermediateCertificate } from './fnmtServerIntermediateCertificate'
import { fnmtServerRootCertificate } from './fnmtServerRootCertificate'

/**
 * Node's bundled roots plus the FNMT server root some administrations chain
 * to, and its intermediate for the hosts that do not send it (ROLECE).
 */
export const trustedCertificateAuthorities: readonly string[] = [
  ...rootCertificates,
  fnmtServerRootCertificate,
  fnmtServerIntermediateCertificate,
]
