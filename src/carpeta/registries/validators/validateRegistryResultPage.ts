import type { RegistryPage } from '../types/RegistryPage'

/** Reject a changed or incomplete result set and any unrelated row in a lookup. */
export const validateRegistryResultPage = (
  page: RegistryPage,
  total: number,
  collected: number,
  requestedNumber: string | undefined,
): void => {
  if (page.total !== total || page.entries.length > total - collected)
    throw new Error(
      'Carpeta: consultaRegistros reported an inconsistent result total',
    )
  if (page.entries.length === 0 && collected < total)
    throw new Error(
      'Carpeta: consultaRegistros returned an incomplete result set',
    )
  if (
    requestedNumber !== undefined &&
    page.entries.some(
      ({ number }) => number.toUpperCase() !== requestedNumber.toUpperCase(),
    )
  )
    throw new Error(
      'Carpeta: consultaRegistros returned a different registry number',
    )
}
