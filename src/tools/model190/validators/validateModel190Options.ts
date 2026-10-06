import type { CliOptions } from '../../../cli/types/CliOptions'
import { plainUpperText } from '../mappers/plainUpperText'
import type { Model190Query } from '../types/Model190Query'
import { readDigitsColumn } from './readDigitsColumn'
import { readNifColumn } from './readNifColumn'
import { requireColumn } from './requireColumn'

/** --datos, --out, --ejercicio, --nif, --nombre, --telefono, --contacto, [--correo] -> the query. */
export const validateModel190Options = (options: CliOptions): Model190Query => {
  const row = Object.fromEntries(
    Object.entries(options).map(([key, value]): [string, string] => [
      key,
      value ?? '',
    ]),
  )
  return {
    datos: requireColumn(row, 'datos'),
    out: requireColumn(row, 'out'),
    declarant: {
      ejercicio: readDigitsColumn(row, 'ejercicio', 4),
      nif: readNifColumn(row, 'nif'),
      nombre: plainUpperText(requireColumn(row, 'nombre')),
      telefono: readDigitsColumn(row, 'telefono', 9),
      contacto: plainUpperText(requireColumn(row, 'contacto')),
      correo: (row['correo'] ?? '').trim(),
    },
  }
}
