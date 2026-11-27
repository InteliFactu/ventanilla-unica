import { readFile } from 'node:fs/promises'

import type { BoeFileValidation } from '../../tools/boeFixedWidth/types/BoeFileValidation'
import { validateBoeFile } from '../../tools/boeFixedWidth/validators/validateBoeFile'
import type { Command } from '../types/Command'

export const validarFicheroBoe: Command = {
  portal: 'validar',
  action: 'fichero-boe',
  description:
    'Check a TGVI file or a tagged modelo 303 offline, with field checks for 190 and 347 (2025) and 303 (2025–2026)',
  options: ['fichero'],
  needsCertificate: false,
  run: async (_client, options): Promise<BoeFileValidation> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // The holder chooses the local input file.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return validateBoeFile(await readFile(fichero, 'latin1'))
  },
}
