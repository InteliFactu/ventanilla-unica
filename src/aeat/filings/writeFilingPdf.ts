import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { FilingsQuery } from './types/FilingsQuery'

/** Write one receipt as `aeat-<modelo>-<ejercicio><periodo>-<expediente>.pdf` under `outDir`. */
export const writeFilingPdf = async (
  outDir: string,
  query: FilingsQuery,
  expediente: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(
    outDir,
    `aeat-${query.modelo}-${query.ejercicio}${query.periodo ?? ''}-${expediente}.pdf`,
  )
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
