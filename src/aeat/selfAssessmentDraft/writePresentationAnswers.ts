import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { DraftFileHeader } from './types/DraftFileHeader'

/** Keep the form's raw answers to the filing as `aeat-<modelo>-<ejercicio><periodo>-presentacion.txt` under `outDir`. */
export const writePresentationAnswers = async (
  outDir: string,
  header: DraftFileHeader,
  answers: readonly string[],
): Promise<string> => {
  const filePath = join(
    outDir,
    `aeat-${header.modelo}-${header.ejercicio}${header.periodo}-presentacion.txt`,
  )
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, answers.join('\n\n'))
  return filePath
}
