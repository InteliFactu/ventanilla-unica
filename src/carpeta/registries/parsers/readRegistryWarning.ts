import { asRecord } from '../../../dehu/api/asRecord'
import { readTextOrNull } from '../../../dehu/api/readTextOrNull'

/**
 * Check `codigoRespuesta` and return the warning text, if any. The front
 * compares `codRespuesta` loosely, so "0" and 0 are the same: 0 is success, 1
 * a warning shown above the list, 2 a catalogued error shown instead of it,
 * and anything else a service error. A missing, null or blank code is refused
 * rather than read as 0. Refusals omit the portal's raw text, as it can
 * include holder data.
 */
export const readRegistryWarning = (
  response: Record<string, unknown>,
): string | null => {
  const status = asRecord(response['codigoRespuesta'])
  const raw = status?.['codRespuesta']
  const code = typeof raw === 'string' ? raw.trim() : raw
  if (code === 0 || code === '0') return null
  if (code === 1 || code === '1')
    return readTextOrNull(status?.['textoRespuesta'])
  if (code === 2 || code === '2')
    throw new Error(
      'Carpeta: consultaRegistros refused the query (codRespuesta 2)',
    )
  throw new Error(
    'Carpeta: consultaRegistros returned an invalid response status',
  )
}
