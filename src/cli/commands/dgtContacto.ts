import { updateDgtContact } from '../../dgt/contact/updateDgtContact'
import { validateDgtContactQuery } from '../../dgt/contact/validators/validateDgtContactQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica dgt contacto --nif <NIF> --correo m --telefono t [--confirmar si]`. */
export const dgtContacto: Command = {
  portal: 'dgt',
  action: 'contacto',
  description:
    "Register or change the holder's email and phone at the DGT (Mis datos de contacto y suscripciones, with the avisos service); --confirmar si to save. The postal address is not touched",
  options: ['nif', 'correo', 'telefono'],
  effect: 'write',
  run: async (client, options) =>
    updateDgtContact(client, validateDgtContactQuery(options), {
      confirmed: isConfirmed(options),
    }),
}
