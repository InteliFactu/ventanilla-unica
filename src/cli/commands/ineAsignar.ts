import { assignIriaSurvey } from '../../ine/assignIriaSurvey'
import { validateIriaOrderNumber } from '../../ine/validators/validateIriaOrderNumber'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

/** `ventanilla-unica ine asignar`: assign the survey of an INE letter to the certificate's IRIA account. */
export const ineAsignar: Command = {
  portal: 'ine',
  action: 'asignar',
  description:
    "Assign a survey to the IRIA account of the certificate's NIF with the nº de orden and contraseña printed on the INE letter: --orden 1005484700I --clave xxxxxxxx, --aviso-correo si to have IRIA mail a notice when each questionnaire opens. --confirmar si to assign",
  options: ['orden', 'clave', 'aviso-correo'],
  effect: 'write',
  run: async (_client, options, identity): Promise<unknown> => {
    const numeroOrden = validateIriaOrderNumber(options['orden'])
    const contrasena = options['clave']?.trim() ?? ''
    if (contrasena === '')
      throw new Error('--clave (the contraseña on the INE letter) is required')
    if (identity === undefined)
      throw new Error('ine asignar needs the holder certificate (--cert/--key)')
    return assignIriaSurvey(
      identity,
      {
        numeroOrden,
        contrasena,
        avisoCorreo: options['aviso-correo'] === 'si',
      },
      isConfirmed(options),
    )
  },
}
