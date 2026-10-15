import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { FilingPdf } from '../types/FilingPdf'

/**
 * Read the PDFs to attach under the front's limits: five files, 10 MiB each,
 * 15 MiB together, names up to 80 characters without the characters its
 * upload refuses (`#>%*&:;¿?/\|"!<¡`).
 */
export const readFilingPdfs = async (
  paths: readonly string[],
): Promise<FilingPdf[]> => {
  const mebibyte = 1024 * 1024
  const maxFiles = 5
  if (paths.length > maxFiles)
    throw new Error(`the REG takes at most ${String(maxFiles)} documents`)
  const pdfs = await Promise.all(
    paths.map(async (path) => {
      // The path is the holder's own --documentos choice, not attacker input.
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = await readFile(path)
      const name = basename(path)
      if (content.subarray(0, 4).toString('latin1') !== '%PDF')
        throw new Error(`${path} is not a PDF`)
      if (content.length > 10 * mebibyte)
        throw new Error(`${path} is larger than the REG's 10 MiB`)
      if (name.length > 80 || /[#>%*&:;¿?/\\|"!<¡]/.test(name))
        throw new Error(`${name}: rename it (80 characters, no #>%*&:;¿?|"!<¡)`)
      return { name, content }
    }),
  )
  if (
    pdfs.reduce((total, pdf) => total + pdf.content.length, 0) >
    15 * mebibyte
  )
    throw new Error("the documents exceed the REG's 15 MiB in total")
  return pdfs
}
