import { join } from 'node:path'

import { writeSignedFile } from '../../signing/xades/writeSignedFile'

/**
 * Keep what filing produced under `--out` as `<stem><suffix>`, never over an
 * existing file. The application is already filed when this runs, so a file
 * that cannot be written is reported, not thrown: the receipt must still
 * reach the holder.
 */
export const writeFilingFiles = async (
  outDir: string,
  stem: string,
  files: Readonly<Record<string, Buffer | undefined>>,
): Promise<{ readonly written: string[]; readonly failed: string[] }> => {
  const written: string[] = []
  const failed: string[] = []
  for (const [suffix, content] of Object.entries(files)) {
    if (content === undefined) continue
    const path = join(outDir, `${stem}${suffix}`)
    try {
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
