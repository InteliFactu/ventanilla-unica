import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { redactCarpetaEvidence } from '../parsers/redactCarpetaEvidence'

/** Only the CLI-selected evidence directory is written; never persist a client key or cookie jar. */
export const writeCarpetaEvidence = async (
  directory: string,
  filename: string,
  content: string | Buffer,
): Promise<string> => {
  // The output directory is the explicit --out destination, as with the other portal writers.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const path = join(directory, filename)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(
    path,
    typeof content === 'string' ? redactCarpetaEvidence(content) : content,
    { mode: 0o600 },
  )
  return path
}
