import { asRecord } from '../../../dehu/api/asRecord'

/** Require the total declared by the API before trusting pagination. */
export const readRegistryTotal = (
  response: Record<string, unknown>,
): number => {
  const raw = asRecord(response['resultados'])?.['num_total_resultados']
  const total =
    typeof raw === 'string' && /^\d+$/.test(raw.trim()) ? Number(raw) : raw
  if (typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0)
    throw new Error(
      'Carpeta: consultaRegistros reported an invalid result total',
    )
  return total
}
