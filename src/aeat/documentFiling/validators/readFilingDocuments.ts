import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { DocumentFilingQuery } from '../types/DocumentFilingQuery'
import type { FilingDocument } from '../types/FilingDocument'
import { maxFilingDocumentBytes } from './maxFilingDocumentBytes'

/** Read every document to attach; the registry takes PDFs up to 64 MiB, and refuses an empty file. */
export const readFilingDocuments = async (
  files: DocumentFilingQuery['files'],
): Promise<FilingDocument[]> =>
  Promise.all(
    files.map(async ({ path, type }) => {
      // The path is the holder's own --documentos choice, not attacker input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = await readFile(path)
      if (content.subarray(0, 4).toString('latin1') !== '%PDF')
        throw new Error(`${path} is not a PDF`)
      if (content.length > maxFilingDocumentBytes)
        throw new Error(`${path} is larger than the registry's 64 MiB`)
      return { name: basename(path), type, content }
    }),
  )
