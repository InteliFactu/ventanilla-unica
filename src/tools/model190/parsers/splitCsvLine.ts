/** Split one CSV line on commas, honouring double-quoted fields and `""` escapes. */
export const splitCsvLine = (line: string): string[] => {
  const fields: string[] = []
  let field = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line.charAt(index)
    if (quoted && char === '"' && line.charAt(index + 1) === '"') {
      field += '"'
      index += 1
    } else if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) {
      fields.push(field.trim())
      field = ''
    } else field += char
  }
  fields.push(field.trim())
  return fields
}
