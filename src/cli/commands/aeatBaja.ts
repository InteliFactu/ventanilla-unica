import { deregisterEntity } from '../../aeat/deregistration/deregisterEntity'
import { parseSuccessors } from '../../aeat/deregistration/parsers/parseSuccessors'
import type { DeregistrationCause } from '../../aeat/deregistration/types/DeregistrationCause'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatBaja: Command = {
  portal: 'aeat',
  action: 'baja',
  description:
    "File a modelo 036 baja en el censo (casillas 150-152) for a legal entity or ESPJ (which also takes it out of the ROI), with the sucesores of page 13 (--sucesores 'NIF;Nombre;%;cuota|...'). Without --confirmar si it plans offline; --validar si fills the 036 and presses Validar at the AEAT, filing nothing; confirmed, it signs and files it, which deregisters the entity with that date",
  options: [
    'nif',
    'causa',
    'fecha',
    'sucesores',
    'lugar',
    'firmado',
    'calidad',
    'validar',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    const causa = options['causa'] ?? 'disolucion'
    if (causa !== 'disolucion' && causa !== 'otras')
      throw new Error('--causa must be disolucion or otras')
    return deregisterEntity(client, {
      nif: nif.toUpperCase(),
      causa: causa satisfies DeregistrationCause,
      fecha: options['fecha'] ?? '',
      sucesores: parseSuccessors(options['sucesores']),
      lugar: options['lugar'] ?? '',
      firmado: options['firmado'] ?? '',
      calidad: options['calidad'] ?? '',
      validate: options['validar'] === 'si',
      confirm: isConfirmed(options),
    })
  },
}
