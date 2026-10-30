import type { HttpClient } from '../../http/types/HttpClient'
import { readXmlMessages } from '../prosa/parsers/readXmlMessages'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { parseNafAuthorisations } from './parsers/parseNafAuthorisations'
import { readCurrentNafAuthorisation } from './parsers/readCurrentNafAuthorisation'
import type { NafRedAuthorisationResult } from './types/NafRedAuthorisationResult'

/**
 * Which Sistema RED authorisation manages the holder's NAF (a self-employed
 * worker's RETA, for instance), and which managed it before, from the sede's
 * "Consulta de autorizado RED que gestiona un NAF" (RETC0002). Read-only: the
 * service opens on the answer for a personal certificate.
 */
export const readNafRedAuthorisation = async (
  client: HttpClient,
): Promise<NafRedAuthorisationResult> => {
  const session = await loginWithCertificate(client, 'RETC0002')
  const titular =
    /<fila1Dinamica[^>]*>([^<]*)<\/fila1Dinamica>/
      .exec(session.xml)?.[1]
      ?.trim() ?? ''
  return {
    titular,
    autorizacionActual: readCurrentNafAuthorisation(session.xml),
    historial: parseNafAuthorisations(session.xml),
    notes: readXmlMessages(session.xml),
  }
}
