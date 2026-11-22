import { readFile } from 'node:fs/promises'

import { presentDeclarationFile } from '../../aeat/declarationFile/presentDeclarationFile'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatPresentarDeclaracion: Command = {
  portal: 'aeat',
  action: 'presentar-declaracion',
  description:
    "File a 390 file through the AEAT's Envío Fichero page, as the holder or an apoderado: --fichero f.txt. Without --confirmar si it reads the file (format and casilla checks) and opens the signature dialog, reporting who signs for whom, and files nothing; confirmed, it ticks Conforme and presents the declaration once, and keeps the page's answers with --out",
  options: ['fichero'],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // fichero is the holder's own --fichero choice, not attacker input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = await readFile(fichero)
    return presentDeclarationFile(
      client,
      file,
      isConfirmed(options),
      options['out'],
    )
  },
}
