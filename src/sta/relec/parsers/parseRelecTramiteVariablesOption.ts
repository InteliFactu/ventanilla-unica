/** Decode the CLI's map of dynamic form field names to literal values. */
export const parseRelecTramiteVariablesOption = (
  raw: string | undefined,
): Readonly<Record<string, string>> | undefined => {
  if (raw === undefined) return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('--campos must be a JSON object of string values')
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error('--campos must be a JSON object of string values')
  const entries = Object.entries(parsed) as [string, unknown][]
  if (entries.some(([, value]) => typeof value !== 'string'))
    throw new Error('--campos must be a JSON object of string values')
  return Object.fromEntries(entries as [string, string][])
}
