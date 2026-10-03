import { planRoleceRegistration } from '../../rolece/application/planRoleceRegistration'
import { validateRegistrationQuery } from '../../rolece/validators/validateRegistrationQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const roleceSolicitud: Command = {
  portal: 'rolece',
  action: 'solicitud',
  description:
    "File a company's initial ROLECE inscription (Solicitud Simplificada of a sociedad mercantil). Without --confirmar si it walks to the unsigned draft, signs it locally and prints the draft and every field it would post; with --confirmar si and --out it posts the signed draft once and saves the acuse de recibo",
  options: [
    'nif',
    'comunidad',
    'provincia',
    'email',
    'email-solicitante',
    'escritura',
    'poderes',
  ],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> =>
    planRoleceRegistration(
      client,
      validateRegistrationQuery(options),
      isConfirmed(options),
      identity,
    ),
}
