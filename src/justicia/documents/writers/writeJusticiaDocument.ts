import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { VisorSession } from '../../session/types/VisorSession'
import { mapJusticiaDocumentFilename } from '../mappers/mapJusticiaDocumentFilename'
import type { JusticiaDocument } from '../types/JusticiaDocument'
import type { VisorFile } from '../types/VisorFile'

/** Save a document under its stable filename in the chosen output directory. */
export const writeJusticiaDocument = async (
  outDir: string,
  session: VisorSession,
  document: JusticiaDocument,
  file: VisorFile,
): Promise<string> => {
  const path = join(
    outDir,
    mapJusticiaDocumentFilename(session, document, file.extension),
  )
  // outDir is the holder's own --out choice; the name is reduced to a safe stem.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, file.bytes)
  return path
}
