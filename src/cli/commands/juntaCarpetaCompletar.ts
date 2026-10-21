import { completeCarpetaProfile } from '../../gobex/filing/completeCarpetaProfile'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** Complete the territorial codes of an existing legal-entity profile without replacing its street address. */
export const juntaCarpetaCompletar: Command = {
  portal: 'junta',
  action: 'carpeta-completar',
  effect: 'write',
  description:
    'Complete --comunidad/--provincia/--municipio territorial codes (as offered by the live form) and --telefono/--correo in an existing Carpeta Ciudadana profile. --confirmar si signs and files the profile update. --out saves the live preview and signing responses. Does not replace the existing street address.',
  options: ['telefono', 'correo', 'comunidad', 'provincia', 'municipio'],
  run: async (client, options, identity): Promise<unknown> => {
    if (
      !identity ||
      !options['telefono'] ||
      !options['correo'] ||
      !options['out'] ||
      !options['comunidad'] ||
      !options['provincia'] ||
      !options['municipio']
    )
      throw new Error(
        'junta carpeta-completar needs --cert/--key, --telefono, --correo and --out',
      )
    if (
      !/^\d{9}$/.test(options['telefono']) ||
      !/^[^@\s]+@[^@.\s]+(?:\.[^@.\s]+)+$/.test(options['correo'])
    )
      throw new Error('Junta: invalid contact fields')
    return completeCarpetaProfile(
      client,
      identity,
      {
        phone: options['telefono'],
        email: options['correo'],
        region: options['comunidad'],
        province: options['provincia'],
        municipality: options['municipio'],
      },
      { confirmed: isConfirmed(options), outDir: options['out'] },
    )
  },
}
