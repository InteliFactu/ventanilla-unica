/** The fields without the named ones: the controls a browser would not submit. */
export const omitFields = (
  fields: Readonly<Record<string, string>>,
  names: readonly string[],
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    Object.entries(fields).filter(([name]) => !names.includes(name)),
  )
