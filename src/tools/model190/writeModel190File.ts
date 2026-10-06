import { readFile, writeFile } from 'node:fs/promises'

import { buildModel190File } from './builders/buildModel190File'
import { centsToEuros } from './mappers/centsToEuros'
import { parsePerceptorRows } from './parsers/parsePerceptorRows'
import type { Model190Query } from './types/Model190Query'
import type { Model190Summary } from './types/Model190Summary'

/**
 * `aeat modelo190`: read the perceptor CSV, build the BOE file and write it in
 * ISO-8859-1, as the design asks. Nothing is sent anywhere; the file is what
 * `aeat informativa` validates and files.
 */
export const writeModel190File = async (
  query: Model190Query,
): Promise<Model190Summary> => {
  // Both paths are the holder's own arguments, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const perceptors = parsePerceptorRows(await readFile(query.datos, 'utf8'))
  if (perceptors.length === 0)
    throw new Error('modelo 190: the CSV has no perceptor rows')
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(
    query.out,
    buildModel190File(query.declarant, perceptors),
    'latin1',
  )
  return {
    fichero: query.out,
    registros: perceptors.length,
    percepciones: centsToEuros(
      perceptors.reduce((sum, row) => sum + row.percepcion, 0),
    ),
    retenciones: centsToEuros(
      perceptors.reduce((sum, row) => sum + row.retencion, 0),
    ),
  }
}
