import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { RelecFile } from '../types/RelecFile'

/**
 * Refuse, before any request, a path that is not a readable PDF within the
 * uploader's limit (`maxSize=50000`, in KB), and hash each one so the plan
 * names exactly the bytes a confirmed run would send.
 */
export const assertRelecFiles = async (
  paths: readonly string[],
): Promise<readonly RelecFile[]> => {
  const maxBytes = 50_000 * 1024
  return Promise.all(
    paths.map(async (path) => {
      // path is the holder's own --documentos choice, not attacker input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = await readFile(path)
      const name = basename(path)
      if (!content.subarray(0, 5).equals(Buffer.from('%PDF-')))
        throw new Error(`not a PDF: ${name}`)
      if (content.length > maxBytes)
        throw new Error(`${name} exceeds the sede's 50000 KB per file`)
      const sha256 = createHash('sha256').update(content).digest('hex')
      return { path, name, bytes: content.length, sha256 }
    }),
  )
}
