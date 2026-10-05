import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

/** Write a PDF the sede returned (base64) under `outDir`, keeping only the base name it suggested, and return the path. */
export const writeNamedPdf = async (
  outDir: string,
  suggested: string | undefined,
  fallback: string,
  base64: string,
): Promise<string> => {
  const name = basename(suggested ?? '') || fallback.replaceAll(/[/\\]/g, '-')
  const path = join(outDir, name)
  // outDir is the holder's own --out choice; the name is reduced to a base name.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, Buffer.from(base64, 'base64'))
  return path
}
