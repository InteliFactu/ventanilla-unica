import { readFile } from 'node:fs/promises'

import { parseSexpeDemand } from '../../sexpe/parsers/parseSexpeDemand'
import type { SexpeDemand } from '../../sexpe/types/SexpeDemand'
import type { Command } from '../types/Command'

export const sexpeDemanda: Command = {
  portal: 'sexpe',
  action: 'demanda',
  description:
    'Read employment demand status offline from a saved SNE result in Latin-1 HTML',
  options: ['captura'],
  needsCertificate: false,
  run: async (_client, options): Promise<SexpeDemand> => {
    const capture = options['captura']
    if (!capture) throw new Error('--captura is required')
    // The holder chooses the local capture.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return parseSexpeDemand(await readFile(capture, 'latin1'))
  },
}
