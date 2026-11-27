import { asRecord } from '../../../dehu/api/asRecord'

/** The `registroResponse` object of a `consultaRegistros` answer; non-JSON is refused. */
export const parseRegistryResponse = (
  text: string,
): Record<string, unknown> => {
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error('Carpeta: the consultaRegistros answer was not JSON')
  }
  return asRecord(asRecord(body)?.['registroResponse']) ?? {}
}
