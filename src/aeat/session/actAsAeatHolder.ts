import { certificateNifs } from '../../certificate/certificateNifs'
import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import { parseActingNif } from '../bulkFiling/parsers/parseActingNif'
import { openAeatSession } from './openAeatSession'
import { switchAeatHolder } from './switchAeatHolder'

/**
 * Make the AEAT session act for `nif`. Nothing happens when the certificate is
 * issued to or on behalf of it; otherwise the represented holder is switched
 * (a power in the Registro de apoderamientos, or the census representation of
 * an entity) and the sede header must then name `nif`. The representation
 * holds for the whole session, so the check lands on Mis Expedientes, a page
 * that carries that header whatever service is read next.
 */
export const actAsAeatHolder = async (
  client: HttpClient,
  identity: CertificateIdentity | undefined,
  nif: string,
  nombre: string | undefined,
): Promise<void> => {
  if (!identity || certificateNifs(identity).includes(nif)) return
  if (!nombre)
    throw new Error(
      `--nombre is required to act for ${nif}, which is not the certificate holder`,
    )
  await openAeatSession(client)
  const acting = parseActingNif(
    await switchAeatHolder(client, nif, nombre, '/wlpl/TEWV-CORE/ResumenVlt'),
  )
  if (acting !== nif)
    throw new Error(
      `AEAT: the session acts for ${acting ?? 'nobody'}, not for ${nif}; the certificate holder may lack a power or representation for it`,
    )
}
