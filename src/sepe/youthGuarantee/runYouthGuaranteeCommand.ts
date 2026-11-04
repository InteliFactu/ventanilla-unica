import type { CliOptions } from '../../cli/types/CliOptions'
import type { HttpClient } from '../../http/types/HttpClient'
import { isConfirmed } from '../../write/isConfirmed'
import { inscribeYouthGuarantee } from './inscribeYouthGuarantee'
import { parseYouthGuaranteeAnswers } from './parsers/parseYouthGuaranteeAnswers'
import { readYouthGuarantee } from './readYouthGuarantee'

export const runYouthGuaranteeCommand = async (
  client: HttpClient,
  options: CliOptions,
): Promise<unknown> => {
  const inscription = options['inscribir']
  if (inscription !== undefined && inscription !== 'si')
    throw new Error('Garantía Juvenil: --inscribir accepts only si')
  if (inscription === undefined) {
    if (isConfirmed(options) || options['respuestas'] !== undefined)
      throw new Error(
        'Garantía Juvenil: --confirmar and --respuestas require --inscribir si',
      )
    return readYouthGuarantee(client, options['out'])
  }
  return inscribeYouthGuarantee(
    client,
    parseYouthGuaranteeAnswers(options['respuestas']),
    isConfirmed(options),
    options['out'],
  )
}
