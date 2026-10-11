import { readFile } from 'node:fs/promises'

import { buildSelfAssessmentDraft } from '../../aeat/selfAssessmentDraft/buildSelfAssessmentDraft'
import type { Command } from '../types/Command'

export const aeatBorradorAutoliquidacion: Command = {
  portal: 'aeat',
  action: 'borrador-autoliquidacion',
  description:
    "Import an autoliquidación file (303) into the AEAT's open simulator of its exercise, which has no login and cannot present: lists the import's errors and avisos and, with --out, saves the Vista previa, the official form filled in and watermarked as a draft: --fichero f.txt",
  options: ['fichero'],
  effect: 'emit',
  run: async (client, options): Promise<unknown> => {
    const fichero = options['fichero']
    if (!fichero) throw new Error('--fichero is required')
    // fichero is the holder's own --fichero choice, not attacker input.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const file = await readFile(fichero)
    return buildSelfAssessmentDraft(client, file, options['out'])
  },
}
