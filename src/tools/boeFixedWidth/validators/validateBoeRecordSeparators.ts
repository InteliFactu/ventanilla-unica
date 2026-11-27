/** Line breaks are optional, but when present must mark record boundaries. */
export const validateBoeRecordSeparators = (
  content: string,
  recordLength: number,
): readonly string[] => {
  if (!/[\r\n]/.test(content)) return []
  const lines = content.replace(/\r?\n$/, '').split(/\r?\n/)
  return lines.every(
    (line) =>
      line.length > 0 &&
      line.length % recordLength === 0 &&
      !line.includes('\r'),
  )
    ? []
    : ['A line break is not at a record boundary']
}
