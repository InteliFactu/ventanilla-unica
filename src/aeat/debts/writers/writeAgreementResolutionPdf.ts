import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Save the requested agreement resolution as a private, exclusively created file. */
export const writeAgreementResolutionPdf = async (
  out: string,
  agreement: string,
  pdf: Buffer,
): Promise<string> => {
  // The output directory is the certificate holder's explicit --out choice.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(out, { recursive: true, mode: 0o700 })
  const path = join(out, `aeat-resolucion-${agreement}.pdf`)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, pdf, { mode: 0o600, flag: 'wx' })
  return path
}
