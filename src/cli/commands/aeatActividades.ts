import { parseActivities } from '../../aeat/activities/parsers/parseActivities'
import { registerActivities } from '../../aeat/activities/registerActivities'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatActividades: Command = {
  portal: 'aeat',
  action: 'actividades',
  description:
    "File a modelo 036 casilla 127 alta of economic activities carried on outside a fixed premises (--actividades 'tipo;seccion;epigrafe;descripcion|...', the values of the AEAT activity finder; --fecha, --provincia, --municipio as the 036 lists them). Without --confirmar si it plans offline; --validar si fills the 036 and presses Validar at the AEAT, filing nothing; confirmed, it signs and files it, which registers the activities in the censo",
  options: [
    'nif',
    'actividades',
    'fecha',
    'provincia',
    'municipio',
    'lugar',
    'firmado',
    'calidad',
    'validar',
  ],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const nif = options['nif']
    if (!nif) throw new Error('--nif is required')
    return registerActivities(client, {
      nif: nif.toUpperCase(),
      actividades: parseActivities(options['actividades']),
      fecha: options['fecha'] ?? '',
      provincia: options['provincia'] ?? '',
      municipio: options['municipio'] ?? '',
      lugar: options['lugar'] ?? '',
      firmado: options['firmado'] ?? '',
      calidad: options['calidad'] ?? 'Interesado',
      validate: options['validar'] === 'si',
      confirm: isConfirmed(options),
    })
  },
}
