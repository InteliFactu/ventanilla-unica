import type { HttpClient } from '../../http/types/HttpClient'
import { openRegistradoresSession } from '../session/openRegistradoresSession'
import { chooseCompany } from './fetchers/chooseCompany'
import { postNotaStep } from './fetchers/postNotaStep'
import { mapSegmentFields } from './mappers/mapSegmentFields'
import type { IdentificationStep } from './types/IdentificationStep'
import type { NotaQuery } from './types/NotaQuery'
import { assertNotaPage } from './validators/assertNotaPage'

/**
 * Log in and walk the read-only part of the order: choose the company, the
 * nota informativa mercantil and its segments. The walk ends on the
 * identification page; nothing up to here creates an order.
 */
export const walkToIdentification = async (
  client: HttpClient,
  query: NotaQuery,
): Promise<IdentificationStep> => {
  const csrf = await openRegistradoresSession(client)
  const choice = await chooseCompany(client, csrf, query.nif)
  const segments = await postNotaStep(
    client,
    'certificado/mercantil/tipos-informacion',
    csrf,
    { tipoInformacion: 'MERC_INFORMACION_GENERAL_MERCANTIL' },
  )
  assertNotaPage(segments, 'name="administradores"', 'choosing the nota')
  const page = await postNotaStep(
    client,
    'certificado/mercantil/segmentos',
    csrf,
    mapSegmentFields(query.segments),
  )
  assertNotaPage(
    page,
    'confirmar-identificacion-invitado',
    'choosing the segments',
  )
  return { csrf, ...choice, page }
}
