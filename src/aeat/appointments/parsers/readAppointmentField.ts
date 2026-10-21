/** Read a quoted slot value without evaluating the portal's JavaScript. */
export const readAppointmentField = (source: string, field: string): string => {
  const match = [...source.matchAll(/'(\w+)':\s*'((?:\\.|[^'])*)'/gu)].find(
    (candidate) => candidate[1] === field,
  )
  if (!match?.[2]) throw new Error(`AEAT appointment slot missing ${field}`)
  return match[2].replaceAll("\\'", "'")
}
