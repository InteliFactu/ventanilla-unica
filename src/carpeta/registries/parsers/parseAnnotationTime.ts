/** An annotation timestamp as epoch milliseconds, so offsets compare as instants; null when missing or unparseable. */
export const parseAnnotationTime = (text: string | null): number | null => {
  if (text === null) return null
  const time = Date.parse(text)
  return Number.isNaN(time) ? null : time
}
