import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Write the justificante under `outDir` as `justificante-<registry number>.pdf` and return its path. */
export const writeRegistryReceiptPdf = async (
  outDir: string,
  registryNumber: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(outDir, `justificante-${registryNumber}.pdf`)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
