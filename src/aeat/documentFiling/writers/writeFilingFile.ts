import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Write one receipt file under outDir and return its path. */
export const writeFilingFile = async (
  outDir: string,
  name: string,
  content: Buffer | string,
): Promise<string> => {
  const filePath = join(outDir, name)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(filePath, content)
  return filePath
}
