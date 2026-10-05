/**
 * Break a text into lines of at most `width` characters at spaces, cutting
 * a word longer than the line (an HMAC, a hash) where it overflows.
 */
export const wrapLine = (text: string, width: number): readonly string[] => {
  const lines: string[] = []
  let current = ''
  for (const word of text.split(' ')) {
    const candidate = current === '' ? word : `${current} ${word}`
    if (candidate.length <= width) {
      current = candidate
      continue
    }
    if (current !== '') lines.push(current)
    let rest = word
    while (rest.length > width) {
      lines.push(rest.slice(0, width))
      rest = rest.slice(width)
    }
    current = rest
  }
  lines.push(current)
  return lines
}
