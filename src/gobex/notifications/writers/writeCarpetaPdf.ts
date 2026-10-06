import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'

/** Write one Carpeta Ciudadana PDF as `fileName` under `outDir` and return its path. */
export const writeCarpetaPdf = async (
  outDir: string,
  fileName: string,
  pdf: Buffer,
): Promise<string> => {
  const path = join(outDir, fileName)
  if (!resolve(path).startsWith(resolve(outDir) + sep))
    throw new Error(`refused to write ${fileName} outside ${outDir}`)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(outDir, { recursive: true })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, pdf)
  return path
}
