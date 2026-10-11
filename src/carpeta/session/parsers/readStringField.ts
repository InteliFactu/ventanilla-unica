import { asRecord } from '../../../dehu/api/asRecord'

/** One string field of a JSON body, or a labelled error naming the field and the status. */
export const readStringField = (
  text: string,
  field: string,
  context: string,
): string => {
  let value: unknown
  try {
    value = asRecord(JSON.parse(text))?.[field]
  } catch {
    value = undefined
  }
  if (typeof value !== 'string' || value === '')
    throw new Error(`Carpeta: ${context} carried no ${field}`)
  return value
}
