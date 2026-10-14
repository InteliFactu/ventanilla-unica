import { readIriaSurveys } from '../../ine/readIriaSurveys'
import type { Command } from '../types/Command'

/** `ventanilla-unica ine encuestas`: the surveys assigned to the certificate's IRIA account. */
export const ineEncuestas: Command = {
  portal: 'ine',
  action: 'encuestas',
  description:
    "The INE surveys assigned to the IRIA account of the certificate's NIF (iria.ine.es, Cl@ve with the certificate), with the sampled unit and whether each survey has questionnaires pending. The account is created once on the web with a survey's nº de orden",
  options: [],
  run: async (_client, _options, identity): Promise<unknown> => {
    if (identity === undefined)
      throw new Error(
        'ine encuestas needs the holder certificate (--cert/--key)',
      )
    return readIriaSurveys(identity)
  },
}
