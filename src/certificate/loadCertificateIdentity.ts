import { readFile } from 'node:fs/promises'

import type { CertificateIdentity } from './types/CertificateIdentity'
import type { CertificatePaths } from './types/CertificatePaths'

/**
 * Read the certificate and key from explicit paths, falling back to the
 * `VENTANILLA_UNICA_CERT` and `VENTANILLA_UNICA_KEY` environment variables. Both are PEM files; a
 * PKCS#12 bundle is converted once with
 * `openssl pkcs12 -legacy -in cert.p12 -clcerts -nokeys -out cert.pem` and
 * `openssl pkcs12 -legacy -in cert.p12 -nocerts -nodes -out key.pem`.
 */
export const loadCertificateIdentity = async (
  paths: CertificatePaths,
): Promise<CertificateIdentity> => {
  const certPath = paths.cert ?? process.env['VENTANILLA_UNICA_CERT']
  const keyPath = paths.key ?? process.env['VENTANILLA_UNICA_KEY']
  if (!certPath || !keyPath)
    throw new Error(
      'certificate required: pass --cert and --key, or set VENTANILLA_UNICA_CERT and VENTANILLA_UNICA_KEY',
    )
  // The paths are the holder's own, given on the command line or in the
  // environment: reading them is the feature, not an injection surface.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const cert = await readFile(certPath)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const key = await readFile(keyPath)
  return {
    cert,
    key,
    passphrase: process.env['VENTANILLA_UNICA_KEY_PASSPHRASE'],
  }
}
