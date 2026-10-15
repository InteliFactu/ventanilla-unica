import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Save an emitted PDF as `fileName` under the holder's chosen `--out`
 * directory. The name carries the `--nif` value, so anything outside
 * `[\w.-]` becomes `_` and the file cannot land outside `outDir`.
 */
export const writeReportPdf = async (
  outDir: string,
  fileName: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(outDir, fileName.replaceAll(/[^\w.-]/g, '_'))
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
