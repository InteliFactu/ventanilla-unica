import { dgtUrls } from '../../session/dgtUrls'
import type { DgtAddressQuery } from '../types/DgtAddressQuery'

/** The requests the CDI change would make, as plan lines; the address ids are not resolved because `service_sadd.jsp` is not mapped. */
export const mapDgtAddressPlan = (query: DgtAddressQuery): string[] => {
  const { nif, ...address } = query
  return [
    `Requested address: ${JSON.stringify(address)}`,
    `Resolve the ids of tipoVia, via, provincia, municipio and localidad with the ${dgtUrls.addressLookup} lookups`,
    `POST ${dgtUrls.addressChangeAct} {nifTitular: ${nif}, domicilioNuevo: <the resolved address as JSON>, tramite: 'CDI', token: <cookie token-tramite-cond>}`,
    `Register it with ${dgtUrls.addressChangeRegistry} (asunto SCDCB) and save the justificante`,
  ]
}
