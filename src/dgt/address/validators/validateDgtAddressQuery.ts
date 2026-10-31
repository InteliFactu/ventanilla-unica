import type { CliOptions } from '../../../cli/types/CliOptions'
import type { DgtAddressQuery } from '../types/DgtAddressQuery'

/** Read `--nif` and the address options of `dgt domicilio`, refusing values the sede would reject. */
export const validateDgtAddressQuery = (
  options: CliOptions,
): DgtAddressQuery => {
  const value = (name: string): string =>
    options[name]?.trim().toUpperCase() ?? ''
  if (!/^[0-9XYZ]\d{7}[A-Z]$/.test(value('nif')))
    throw new Error('--nif must be the holder NIF/NIE, e.g. 12345678Z')
  for (const required of [
    'tipo-via',
    'via',
    'numero',
    'municipio',
    'provincia',
  ])
    if (value(required) === '') throw new Error(`--${required} is required`)
  if (!/^\d{5}$/.test(value('codigo-postal')))
    throw new Error('--codigo-postal must be five digits')
  return {
    nif: value('nif'),
    tipoVia: value('tipo-via'),
    via: value('via'),
    numero: value('numero'),
    planta: value('planta'),
    puerta: value('puerta'),
    cp: value('codigo-postal'),
    municipio: value('municipio'),
    provincia: value('provincia'),
    localidad: value('localidad'),
  }
}
