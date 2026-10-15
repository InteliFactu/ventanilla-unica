import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Write one receipt PDF as `aeat-pago-<nrc>.pdf` under outDir; the NRC is unique, the justificante is not. */
export const writePaymentReceipt = async (
  outDir: string,
  nrc: string,
  pdf: Buffer,
): Promise<string> => {
  const filePath = join(outDir, `aeat-pago-${nrc}.pdf`)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, pdf)
  return filePath
}
