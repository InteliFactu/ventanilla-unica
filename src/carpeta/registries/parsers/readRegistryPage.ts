import { mapRegistryEntry } from '../mappers/mapRegistryEntry'
import type { RegistryPage } from '../types/RegistryPage'
import { parseRegistryResponse } from './parseRegistryResponse'
import { readRegistryItems } from './readRegistryItems'
import { readRegistryTotal } from './readRegistryTotal'
import { readRegistryWarning } from './readRegistryWarning'

/** Read a `consultaRegistros` answer, `{ registroResponse: { codigoRespuesta, resultados, asientos } }`. */
export const readRegistryPage = (text: string): RegistryPage => {
  const response = parseRegistryResponse(text)
  const warning = readRegistryWarning(response)
  const total = readRegistryTotal(response)
  const entries = readRegistryItems(response, total).map((item) =>
    mapRegistryEntry(item),
  )
  return {
    total,
    entries,
    warning,
  }
}
