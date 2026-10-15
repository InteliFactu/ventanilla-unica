import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { safeFileStem } from '../../../dehu/documents/mappers/safeFileStem'
import type { VisorFile } from '../types/VisorFile'

/** Save one document as `justicia-<procedimiento>-<numero><ext>` under `outDir` and return its path. */
export const writeJusticiaDocument = async (
  outDir: string,
  procedimiento: string,
  numero: string,
  file: VisorFile,
): Promise<string> => {
  const path = join(
    outDir,
    safeFileStem(
      `justicia-${procedimiento}-${numero.padStart(3, '0')}${file.extension}`,
    ),
  )
  // outDir is the holder's own --out choice; the name is reduced to a safe stem.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, file.bytes)
  return path
}
