import type { CliOptions } from '../../../cli/types/CliOptions'
import type { DgtAddressQuery } from '../types/DgtAddressQuery'
import { readUpperOption } from './readUpperOption'

/** Read `--nif` and the address options of `dgt domicilio`, refusing values the sede would reject. */
export const validateDgtAddressQuery = (
  options: CliOptions,
): DgtAddressQuery => {
  if (!/^[0-9XYZ]\d{7}[A-Z]$/.test(readUpperOption(options, 'nif')))
    throw new Error('--nif must be the holder NIF/NIE, e.g. 12345678Z')
  for (const required of [
    'tipo-via',
    'via',
    'numero',
    'municipio',
    'provincia',
  ])
    if (readUpperOption(options, required) === '')
      throw new Error(`--${required} is required`)
  if (!/^\d{5}$/.test(readUpperOption(options, 'codigo-postal')))
    throw new Error('--codigo-postal must be five digits')
  return {
    nif: readUpperOption(options, 'nif'),
    tipoVia: readUpperOption(options, 'tipo-via'),
    via: readUpperOption(options, 'via'),
    numero: readUpperOption(options, 'numero'),
    planta: readUpperOption(options, 'planta'),
    puerta: readUpperOption(options, 'puerta'),
    cp: readUpperOption(options, 'codigo-postal'),
    municipio: readUpperOption(options, 'municipio'),
    provincia: readUpperOption(options, 'provincia'),
    localidad: readUpperOption(options, 'localidad'),
  }
}
