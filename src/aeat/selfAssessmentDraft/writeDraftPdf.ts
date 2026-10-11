import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { DraftFileHeader } from './types/DraftFileHeader'

/** Write the draft as `aeat-<modelo>-<ejercicio><periodo>-borrador.pdf` under `outDir`. */
export const writeDraftPdf = async (
  outDir: string,
  header: DraftFileHeader,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(
    outDir,
    `aeat-${header.modelo}-${header.ejercicio}${header.periodo}-borrador.pdf`,
  )
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
