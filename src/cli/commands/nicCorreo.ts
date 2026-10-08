import { requestContactEmailChange } from '../../nic/contactEmail/requestContactEmailChange'
import { validateContactEmailQuery } from '../../nic/contactEmail/validators/validateContactEmailQuery'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const nicCorreo: Command = {
  portal: 'nic',
  action: 'correo',
  description:
    "Ask Red.es (nic.es) to change an ES-NIC contact's email, signed with the holder certificate (--identificador 1727AF1-ESNIC-F5, --email new@address); --confirmar si to file. The change waits for the registry's approval",
  options: ['identificador', 'email'],
  effect: 'write',
  run: async (client, options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error('nic correo needs the holder certificate (--cert/--key)')
    return requestContactEmailChange(
      client,
      validateContactEmailQuery(options),
      {
        identity,
        confirmed: isConfirmed(options),
      },
    )
  },
}
