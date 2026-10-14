import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { createHttpClient } from '../../http/createHttpClient'
import type { IriaSession } from '../types/IriaSession'
import { loginToIria } from './loginToIria'

/**
 * Log in to IRIA with the certificate, on a fresh client per attempt. On
 * 2026-10-15, right after the account was created, about half the logins of a
 * registered NIF landed on `errorCertificado=3` ("No existe ningún usuario
 * con este NIF"); retrying on the same client hit it every time (the session
 * cookie pins the node), a fresh client went through. Misses on every attempt
 * mean the NIF has no IRIA account, which is created once on the web (it asks
 * for a reCAPTCHA).
 */
export const openIriaSession = async (
  identity: CertificateIdentity,
): Promise<IriaSession> => {
  const attempts = 4
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const client = createHttpClient(identity)
    const page = await loginToIria(client)
    if (!page.url.includes('errorCertificado')) return { client, page }
  }
  throw new Error(
    `IRIA: no user for this certificate's NIF (errorCertificado=3 on ${String(attempts)} logins); register it once at iria.ine.es with a survey's nº de orden`,
  )
}
