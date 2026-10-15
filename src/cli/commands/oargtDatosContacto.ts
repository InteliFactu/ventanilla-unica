import { confirmStaContactData } from '../../sta/contact/confirmStaContactData'
import { validateContactQuery } from '../../sta/contact/validators/validateContactQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica oargt datos-contacto`: answer the sede's contact-data gate. */
export const oargtDatosContacto: Command = {
  portal: 'oargt',
  action: 'datos-contacto',
  description:
    'Answer the OARGT Cáceres sede (sede.oargt.es) contact-data gate (CONFIRMACION_DATOS_PERSONALES): --correo (required) and --telefono are saved when the sede holds none; when it already holds them only "Sí" is pressed; without --confirmar si it only says whether the gate is up',
  options: ['correo', 'telefono'],
  effect: 'write',
  run: async (client, options): Promise<unknown> =>
    confirmStaContactData(
      client,
      'oargt',
      validateContactQuery(options),
      isConfirmed(options),
    ),
}
