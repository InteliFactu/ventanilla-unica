import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

/** Refuse, before any request, a path that is not a readable PDF under the sede's 9.8 MB limit. */
export const assertPdfFiles = async (
  paths: readonly string[],
): Promise<readonly { readonly name: string; readonly bytes: number }[]> => {
  const maxBytes = 9.8 * 1024 * 1024
  return Promise.all(
    paths.map(async (path) => {
      // path is the holder's own --documentos choice, not attacker input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = await readFile(path)
      const name = basename(path)
      if (!content.subarray(0, 5).equals(Buffer.from('%PDF-')))
        throw new Error(`not a PDF: ${name}`)
      if (content.length > maxBytes)
        throw new Error(`${name} exceeds the sede's 9.8 MB per file`)
      return { name, bytes: content.length }
    }),
  )
}
