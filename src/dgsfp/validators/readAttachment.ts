import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { DgsfpAttachment } from '../types/DgsfpAttachment'

/**
 * Read one PDF for a file control and refuse, before any request, what the
 * page's FilePond would refuse: a name over 150 characters, or a base name
 * with anything but letters, digits, spaces, accented vowels, ñ, hyphens,
 * underscores and parentheses (its `onlyLettersAndNumbers`).
 */
export const readAttachment = async (
  field: string,
  path: string,
): Promise<DgsfpAttachment> => {
  const maxName = 150
  const name = basename(path)
  const stem = name.slice(0, name.lastIndexOf('.'))
  if (name.length > maxName || !/^[\w\s\-()áéíóúñ]*$/i.test(stem))
    throw new Error(
      `DGSFP refuses the file name "${name}": use letters, digits, spaces, hyphens, underscores and parentheses only`,
    )
  // path is the holder's own option value, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const content = await readFile(path)
  if (!content.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error(`not a PDF: ${name}`)
  const hash = createHash('sha256').update(content).digest('hex')
  return { field, name, content, hash }
}
