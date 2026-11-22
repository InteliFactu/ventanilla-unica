import { readFile } from 'node:fs/promises'

import { checkDeclarationFile } from '../../aeat/declarationFile/checkDeclarationFile'
import type { Command } from '../types/Command'

export const aeatValidarDeclaracion: Command = {
  portal: 'aeat',
  action: 'validar-declaracion',
  description:
    "Read a model file (390) on the AEAT's Envío Fichero page, as the holder or an apoderado: the AEAT runs the model's format and casilla checks and lists its errors and avisos. Firmar y enviar is never pressed: --fichero f.txt",
  options: ['fichero'],
  run: async (client, options): Promise<unknown> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // fichero is the holder's own --fichero choice, not attacker input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = await readFile(fichero)
    return checkDeclarationFile(client, file)
  },
}
