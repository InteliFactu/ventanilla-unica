import { readFile } from 'node:fs/promises'

import { dryRunSelfAssessment } from '../../aeat/selfAssessmentDraft/dryRunSelfAssessment'
import type { Command } from '../types/Command'

export const aeatValidarAutoliquidacion: Command = {
  portal: 'aeat',
  action: 'validar-autoliquidacion',
  description:
    "Run a 303 file through the AEAT's real presentation form of its holder (census window, Importar, Validar), as the holder or an apoderado: lists the import's and Validar's errors and avisos and, with --out, saves the Vista previa. Guardar and Presentar are never pressed: --fichero f.txt",
  options: ['fichero'],
  run: async (client, options): Promise<unknown> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // fichero is the holder's own --fichero choice, not attacker input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = await readFile(fichero)
    return dryRunSelfAssessment(client, file, options['out'])
  },
}
