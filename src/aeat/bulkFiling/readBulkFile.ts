import { readFile } from 'node:fs/promises'

import { parseBulkFile } from './parsers/parseBulkFile'
import type { BulkFile } from './types/BulkFile'

/** Read the file as the page does (ISO-8859-1 text) and split it into records. */
export const readBulkFile = async (path: string): Promise<BulkFile> =>
  // The path is the holder's own --fichero, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  parseBulkFile(await readFile(path, 'latin1'))
