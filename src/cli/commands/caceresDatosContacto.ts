import { confirmStaContactData } from '../../sta/contact/confirmStaContactData'
import { validateContactQuery } from '../../sta/contact/validators/validateContactQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres datos-contacto`: answer the sede's contact-data gate. */
export const caceresDatosContacto: Command = {
  portal: 'caceres',
  action: 'datos-contacto',
  description:
    'Answer the Ayuntamiento de Cáceres sede contact-data gate (CONFIRMACION_DATOS_PERSONALES) that a certificate meets on its first login: --correo (required) and --telefono; without --confirmar si it only says whether the gate is up',
  options: ['correo', 'telefono'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    confirmStaContactData(
      client,
      'caceres',
      validateContactQuery(options),
      isConfirmed(options),
    ),
}
