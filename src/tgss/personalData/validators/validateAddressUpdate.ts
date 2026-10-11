import type { CliOptions } from '../../../cli/types/CliOptions'
import type { AddressUpdate } from '../types/AddressUpdate'

/** A Spanish domicile from `--tipo-via`, `--via`, `--numero`, `--codigo-postal`, `--localidad` and the optional parts. */
export const validateAddressUpdate = (options: CliOptions): AddressUpdate => {
  const value = (name: string): string => options[name]?.trim() ?? ''
  const tipoVia = value('tipo-via').toUpperCase()
  if (!['AV', 'CL', 'CT', 'PP', 'PZ', 'ZZ'].includes(tipoVia))
    throw new Error('--tipo-via must be AV, CL, CT, PP, PZ or ZZ')
  for (const required of ['via', 'numero', 'localidad'])
    if (value(required) === '') throw new Error(`--${required} is required`)
  if (!/^\d{5}$/.test(value('codigo-postal')))
    throw new Error('--codigo-postal must be five digits')
  return {
    tipoVia,
    nombreVia: value('via').toUpperCase(),
    numero: value('numero'),
    bis: value('bis'),
    bloque: value('bloque'),
    escalera: value('escalera'),
    piso: value('piso'),
    puerta: value('puerta').toUpperCase(),
    codigoPostal: value('codigo-postal'),
    localidad: value('localidad').toUpperCase(),
  }
}
