import type { CliOptions } from '../../../cli/types/CliOptions'
import type { NotaAddress } from '../types/NotaAddress'

/**
 * The billing address cannot be derived (the sede's NIF check gives the
 * province only), so ordering needs `--direccion` and `--codigo-postal`; the
 * plan runs without them.
 */
export const validateNotaAddress = (
  options: CliOptions,
  confirmed: boolean,
): NotaAddress => {
  const direccion = options['direccion']?.trim() || undefined
  const codigoPostal = options['codigo-postal']?.trim() || undefined
  if (codigoPostal !== undefined && !/^\d{5}$/.test(codigoPostal))
    throw new Error('--codigo-postal must be five digits')
  if (confirmed && (direccion === undefined || codigoPostal === undefined))
    throw new Error(
      '--direccion and --codigo-postal are required with --confirmar si (the billing address)',
    )
  return { direccion, codigoPostal }
}
