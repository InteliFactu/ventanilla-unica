import { readRoleceStatus } from '../../rolece/status/readRoleceStatus'
import { validateRoleceNif } from '../../rolece/validators/validateRoleceNif'
import type { Command } from '../types/Command'

export const roleceEstado: Command = {
  portal: 'rolece',
  action: 'estado',
  description:
    'Whether a company is inscribed in ROLECE (Registro Oficial de Licitadores), and whether an initial application is due; --out reports why the certificate is not downloaded (captcha)',
  options: ['nif'],
  run: async (client, options): Promise<unknown> =>
    readRoleceStatus(client, validateRoleceNif(options['nif']), options['out']),
}
