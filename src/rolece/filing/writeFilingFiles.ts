import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { writeSignedFile } from '../../signing/xades/writeSignedFile'
import type { FilingFilesOutcome } from '../types/FilingFilesOutcome'

/**
 * Keep what filing produced under `--out` as `<stem><suffix>`, creating the
 * directory if needed and never overwriting a file. Filing precedes this, so a file
 * that cannot be written is reported, not thrown: the receipt must still
 * reach the holder.
 */
export const writeFilingFiles = async (
  outDir: string,
  stem: string,
  files: Readonly<Record<string, Buffer | undefined>>,
): Promise<FilingFilesOutcome> => {
  const written: string[] = []
  const failed: string[] = []
  for (const [suffix, content] of Object.entries(files)) {
    if (content === undefined) continue
    const path = join(outDir, `${stem}${suffix}`)
    try {
      // The holder chooses the output directory before submitting the filing.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await mkdir(outDir, { recursive: true })
      await writeSignedFile(path, content)
      written.push(path)
    } catch (error) {
      failed.push(
        `${path}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
  return { written, failed }
}
