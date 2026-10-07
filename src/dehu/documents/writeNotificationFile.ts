import { writeFile } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import type { WrittenNotificationFile } from './types/WrittenNotificationFile'

/** Decode one base64 document and write it as `fileName` under `outDir`. */
export const writeNotificationFile = async (
  outDir: string,
  fileName: string,
  content: string,
): Promise<WrittenNotificationFile> => {
  const bytes = Buffer.from(content, 'base64')
  const path = join(outDir, fileName)
  if (!resolve(path).startsWith(resolve(outDir) + sep))
    throw new Error(`refused to write ${fileName} outside ${outDir}`)
  // outDir is the holder's own --out choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, bytes)
  return { path, bytes: bytes.length }
}
