import type { HttpClient } from '../../http/types/HttpClient'
import { fetchAvisosDetail } from './fetchers/fetchAvisosDetail'
import { fetchCensalData } from './fetchers/fetchCensalData'
import { readLabelledSpan } from './parsers/readLabelledSpan'
import { readTitledTables } from './parsers/readTitledTables'
import type { AeatContact } from './types/AeatContact'

/**
 * `aeat contacto`: the mobile and email the AEAT sends avisos to and the
 * fiscal and notification addresses of the certificate holder. Read-only;
 * refuses a page that does not name `nif`.
 */
export const readAeatContact = async (
  client: HttpClient,
  nif: string,
): Promise<AeatContact> => {
  const censal = await fetchCensalData(client)
  const avisos = await fetchAvisosDetail(client)
  if (!censal.includes(nif) || !avisos.includes(nif))
    throw new Error(`AEAT: the pages read do not belong to --nif ${nif}`)
  return {
    nif,
    mobile: readLabelledSpan(avisos, 'Teléfono móvil'),
    email: readLabelledSpan(avisos, 'Correo electrónico'),
    avisosState: readLabelledSpan(avisos, 'Estado'),
    avisosStateDate: readLabelledSpan(avisos, 'Fecha de estado'),
    fiscalAddress: readTitledTables(censal, 'Domicilio Fiscal'),
    notificationAddress: readTitledTables(censal, 'Domicilio de Notificación'),
  }
}
