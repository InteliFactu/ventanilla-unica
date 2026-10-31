import type { HttpClient } from '../../http/types/HttpClient'
import type { WriteResult } from '../../write/types/WriteResult'
import { fetchAtexHolder } from '../holder/fetchers/fetchAtexHolder'
import { readAtexHolder } from '../holder/parsers/readAtexHolder'
import { readDgtJson } from '../holder/parsers/readDgtJson'
import { dgtUrls } from '../session/dgtUrls'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { mapDgtAddressPlan } from './mappers/mapDgtAddressPlan'
import type { DgtAddressQuery } from './types/DgtAddressQuery'
import { isSameDgtAddress } from './validators/isSameDgtAddress'

/**
 * Plan a change of the address the DGT notifies to by post ("Cambio de
 * domicilio", trámite CDI). Plan only: the `service_sadd.jsp` lookups and the
 * `domicilioNuevo` JSON have not been captured, and the owner has not chosen a
 * new domicile, so confirmation is refused before any request is made.
 */
export const planDgtAddressChange = async (
  client: HttpClient,
  query: DgtAddressQuery,
  confirmed: boolean,
): Promise<WriteResult<never>> => {
  if (confirmed)
    throw new Error(
      'dgt domicilio cannot submit yet: the service_sadd.jsp lookups and the domicilioNuevo of service_cond.jsp have not been captured. Nothing was sent.',
    )
  await loginWithCertificate(client, dgtUrls.addressChangePage)
  const holder = readAtexHolder(
    readDgtJson(await fetchAtexHolder(client, query.nif), 'holder data'),
  )
  if (holder.nif.toUpperCase() !== query.nif)
    throw new Error(
      `DGT: the session belongs to ${holder.nif}, not to ${query.nif}`,
    )
  const current = holder.direccionNotificaciones
  const titular = `Holder ${holder.nombre} (${holder.nif})`
  if (current && isSameDgtAddress(current, query))
    return {
      action: 'dgt domicilio',
      executed: false,
      plan: [
        `${titular}: the DGT already notifies to this address; nothing to change`,
      ],
      notes: [],
    }
  return {
    action: 'dgt domicilio',
    executed: false,
    plan: [
      titular,
      `Current notification address: ${current?.texto ?? 'none on record'}`,
      ...mapDgtAddressPlan(query),
    ],
    notes: [
      'Only the holder data was read; this command never submits the change.',
      'Legal effect once built: the DGT sends its postal notifications, sanctions included, to the new address.',
    ],
  }
}
