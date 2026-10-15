/** `--pagina`: a positive whole number, 1 when absent. */
export const validatePage = (value: string | undefined): number => {
  if (value === undefined) return 1
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1)
    throw new Error(`--pagina must be a positive whole number, got "${value}"`)
  return page
}
