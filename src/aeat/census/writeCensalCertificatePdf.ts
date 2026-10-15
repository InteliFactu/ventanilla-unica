import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Write the certificate as `aeat-censal-<nif>-<csv>.pdf` under outDir. */
export const writeCensalCertificatePdf = async (
  outDir: string,
  label: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(outDir, `aeat-censal-${label}.pdf`)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
