import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Store the verified PDF as `aeat-csv-<csv>.pdf` in the --out directory and return its path. */
export const saveCsvDocument = async (
  directory: string,
  csv: string,
  pdf: Buffer,
): Promise<string> => {
  const target = join(directory, `aeat-csv-${csv}.pdf`)
  // The directory is the holder's own --out choice and the name is built here.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(directory, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(target, pdf)
  return target
}
