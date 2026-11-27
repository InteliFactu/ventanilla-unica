import { readRelecProcedure } from '../../sta/relec/readRelecProcedure'
import type { Command } from '../types/Command'

/** `ventanilla-unica caceres procedimiento`: what a Cáceres catalogue procedure's Relec form asks for. */
export const caceresProcedimiento: Command = {
  portal: 'caceres',
  action: 'procedimiento',
  description:
    'Open a Cáceres sede catalogue procedure\'s Relec form (--dboid, e.g. 6269000000342016807935 "Instancia general"). List its "Solicito" fields, the extra text fields accepted by caceres tramite --campos, and its document rows without filing anything',
  options: ['dboid'],
  run: async (client, options): Promise<unknown> => {
    const dboid = options['dboid'] ?? ''
    if (!/^\d{22}$/.test(dboid))
      throw new Error(
        '--dboid must be the 22-digit procedure id (e.g. 6269000000342016807935)',
      )
    return readRelecProcedure(client, dboid)
  },
}
