/** A page number as `--pagina` or AutoFirma's `signaturePage` give it: 1-based, negative from the end. */
export const parsePdfPage = (value: string | undefined): number | undefined => {
  if (value === undefined || value.trim() === '') return undefined
  const page = Number(value.trim())
  if (!Number.isInteger(page) || page === 0)
    throw new Error(`page must be a non-zero integer: ${value}`)
  return page
}
