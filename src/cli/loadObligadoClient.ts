import { certificateNifs } from '../certificate/certificateNifs'
import { loadCertificateIdentity } from '../certificate/loadCertificateIdentity'
import { createHttpClient } from '../http/createHttpClient'
import type { HttpClient } from '../http/types/HttpClient'
import type { CliOptions } from './types/CliOptions'

/** Load the separate MisPagos identity only from explicitly supplied PEM paths. */
export const loadObligadoClient = async (
  options: CliOptions,
  nif: string,
): Promise<HttpClient | undefined> => {
  const cert = options['cert-obligado']
  const key = options['key-obligado']
  if (cert === undefined && key === undefined) return undefined
  if (!cert || !key)
    throw new Error('--cert-obligado and --key-obligado go together')
  const identity = await loadCertificateIdentity({ cert, key })
  if (!certificateNifs(identity).includes(nif))
    throw new Error(
      `--cert-obligado was not issued to or for the obligado ${nif}`,
    )
  return createHttpClient({
    ...identity,
    passphrase: process.env['VENTANILLA_UNICA_OBLIGADO_KEY_PASSPHRASE'],
  })
}
