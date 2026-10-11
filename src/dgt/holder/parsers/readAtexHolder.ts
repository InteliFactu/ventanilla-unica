import { mapAtexAddress } from '../mappers/mapAtexAddress'
import type { DgtAtexHolder } from '../types/DgtAtexHolder'
import { readText } from './readText'

/**
 * Identity and notification address from an ATEX answer. Its `error` member
 * is about vehicles and may sit beside a good answer, so only a missing
 * `personaFisica`/`personaJuridica` is an error.
 */
export const readAtexHolder = (
  json: Record<string, unknown>,
): DgtAtexHolder => {
  const person = json['personaFisica'] ?? json['personaJuridica']
  if (person === undefined)
    throw new Error(
      `DGT holder data: ${readText(json['error'], 'errorMsg') || 'no person in the answer'}`,
    )
  const nombre = ['nombre', 'apellido1', 'apellido2']
    .map((key) => readText(person, key))
    .filter(Boolean)
    .join(' ')
  const address = json['domicilioCompleto']
  return {
    nif: readText(person, 'nif'),
    nombre: nombre || readText(person, 'rs'),
    direccionNotificaciones:
      readText(address, 'domicilioCompleto') === 'OK'
        ? mapAtexAddress(address)
        : undefined,
  }
}
