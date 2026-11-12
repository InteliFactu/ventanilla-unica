import type { CliOptions } from '../../cli/types/CliOptions'
import type { HttpClient } from '../../http/types/HttpClient'
import { isConfirmed } from '../../write/isConfirmed'
import { inscribeYouthGuarantee } from './inscribeYouthGuarantee'
import { parseYouthGuaranteeAnswers } from './parsers/parseYouthGuaranteeAnswers'
import { parseYouthGuaranteeContactIntent } from './parsers/parseYouthGuaranteeContactIntent'
import { readYouthGuarantee } from './readYouthGuarantee'

export const runYouthGuaranteeCommand = async (
  client: HttpClient,
  options: CliOptions,
): Promise<unknown> => {
  const inscription = options['inscribir']
  if (inscription !== undefined && inscription !== 'si')
    throw new Error('Garantía Juvenil: --inscribir accepts only si')
  if (inscription === undefined) {
    if (
      isConfirmed(options) ||
      options['respuestas'] !== undefined ||
      options['pin-fichero'] !== undefined ||
      options['enlace-fichero'] !== undefined ||
      options['sms'] !== undefined ||
      options['correo'] !== undefined
    )
      throw new Error(
        'Garantía Juvenil: --confirmar, --respuestas, --sms, --correo and verification files require --inscribir si',
      )
    return readYouthGuarantee(client, options['out'])
  }
  return inscribeYouthGuarantee(
    client,
    parseYouthGuaranteeAnswers(options['respuestas']),
    isConfirmed(options),
    {
      out: options['out'],
      pinFile: options['pin-fichero'],
      linkFile: options['enlace-fichero'],
      mobileIntent: parseYouthGuaranteeContactIntent(options['sms'], 'sms'),
      emailIntent: parseYouthGuaranteeContactIntent(
        options['correo'],
        'correo',
      ),
    },
  )
}
