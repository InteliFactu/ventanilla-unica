import type { DgtAddress } from '../../holder/types/DgtAddress'
import type { DgtAddressQuery } from '../types/DgtAddressQuery'

/**
 * True when the notification address ATEX holds already equals the requested
 * one. ATEX carries no locality, so the comparison covers the fields it has,
 * ignoring case and surrounding spaces.
 */
export const isSameDgtAddress = (
  current: DgtAddress,
  query: DgtAddressQuery,
): boolean =>
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
