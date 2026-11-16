/** A template field that must be present; numbers such as ids arrive as JSON numbers or strings. */
export const readRayuelaConfigText = (
  config: Readonly<Record<string, unknown>>,
  name: string,
): string => {
  const value = config[name]
  if (typeof value === 'string' || typeof value === 'number')
    return String(value)
  throw new Error(`Rayuela template field is missing: ${name}`)
}
