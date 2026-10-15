import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { InformativesQuery } from './types/InformativesQuery'

/** Write one receipt as `aeat-<modelo>-<ejercicio>-<expediente>.pdf` under outDir. */
export const writeInformativePdf = async (
  outDir: string,
  query: InformativesQuery,
  expediente: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(
    outDir,
    `aeat-${query.modelo}-${query.ejercicio}-${expediente}.pdf`,
  )
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
