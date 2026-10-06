/** One response header as a string; a repeated header keeps its first value. */
export const headerValue = (
  headers: Readonly<Record<string, string | string[] | undefined>>,
  name: string,
): string | undefined => {
  const value = headers[name]
  return Array.isArray(value) ? value[0] : value
}
