import type { DgtAddress } from '../../holder/types/DgtAddress'
import type { DgtAddressQuery } from '../types/DgtAddressQuery'

/**
 * True when the notification address ATEX holds already equals the requested
 * one, ignoring case and surrounding spaces. ATEX carries no locality, so a
 * request naming one can never be proven equal and is always planned.
 */
export const isSameDgtAddress = (
  current: DgtAddress,
  query: DgtAddressQuery,
): boolean =>
  query.localidad === '' &&
  (
    [
      'tipoVia',
      'via',
      'numero',
      'planta',
      'puerta',
      'cp',
      'municipio',
      'provincia',
    ] as const
  ).every((key) => current[key].trim().toUpperCase() === query[key])
