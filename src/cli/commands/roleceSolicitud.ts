import { planRoleceRegistration } from '../../rolece/application/planRoleceRegistration'
import { validateRegistrationQuery } from '../../rolece/validators/validateRegistrationQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const roleceSolicitud: Command = {
  portal: 'rolece',
  action: 'solicitud',
  description:
    "Plan a company's initial ROLECE inscription (Solicitud Simplificada of a sociedad mercantil): every field it would post; --confirmar si refuses until the signing step is captured",
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
  run: async (client, options): Promise<unknown> =>
    planRoleceRegistration(
      client,
      validateRegistrationQuery(options),
      isConfirmed(options),
    ),
}
