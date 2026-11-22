import { readFile } from 'node:fs/promises'

import { presentSelfAssessment } from '../../aeat/selfAssessmentDraft/presentSelfAssessment'
import { isConfirmed } from '../../write/isConfirmed'
import type { Command } from '../types/Command'

export const aeatPresentarAutoliquidacion: Command = {
  portal: 'aeat',
  action: 'presentar-autoliquidacion',
  description:
    "File a 303 file through the holder's presentation form, as the holder or an apoderado: --fichero f.txt. Without --confirmar si it imports, validates and opens the signature dialog, reporting the result, the forma de pago and who signs for whom, and files nothing; confirmed, it ticks Conforme and signs and sends it, which presents the autoliquidación (a rectificativa when the file says so), and keeps the form's answers with --out",
  options: ['fichero'],
  effect: 'write',
  run: async (client, options): Promise<unknown> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // fichero is the holder's own --fichero choice, not attacker input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = await readFile(fichero)
    return presentSelfAssessment(
      client,
      file,
      isConfirmed(options),
      options['out'],
    )
  },
}
