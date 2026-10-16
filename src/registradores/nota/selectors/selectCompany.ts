import { normalizeNif } from '../../../tools/nif/mappers/normalizeNif'
import type { NotaCompany } from '../types/NotaCompany'

/** The search row of the NIF asked for; refuses when the Registro Mercantil has none. */
export const selectCompany = (
  rows: readonly NotaCompany[],
  nif: string,
): NotaCompany => {
  const company = rows.find((row) => normalizeNif(row.nif) === nif)
  if (!company)
    throw new Error(
      `registradores: no company with NIF ${nif} in the Registro Mercantil (${String(rows.length)} rows found)`,
    )
  return company
}
