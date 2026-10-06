import { validateModel190Options } from '../../tools/model190/validators/validateModel190Options'
import { writeModel190File } from '../../tools/model190/writeModel190File'
import type { Command } from '../types/Command'

export const aeatModelo190: Command = {
  portal: 'aeat',
  action: 'modelo190',
  description:
    'Build the BOE file of a modelo 190 (claves A and L) from a perceptor CSV, offline: --datos f.csv (nif,nombre,provincia,clave,subclave,percepcion,retencion,gastos,nacimiento,situacion,contrato) --out f.txt --ejercicio --nif --nombre --telefono --contacto [--correo]. Nothing is sent; `aeat informativa` validates and files it',
  options: [
    'datos',
    'ejercicio',
    'nif',
    'nombre',
    'telefono',
    'contacto',
    'correo',
  ],
  needsCertificate: false,
  run: async (_client, options): Promise<unknown> =>
    writeModel190File(validateModel190Options(options)),
}
