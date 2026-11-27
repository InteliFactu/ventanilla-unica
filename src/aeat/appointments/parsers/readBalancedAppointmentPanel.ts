/** Read a receipt div and its own contents, ending at the matching close. */
export const readBalancedAppointmentPanel = (
  fromOpening: string,
): string | undefined => {
  let depth = 0
  for (const tag of fromOpening.matchAll(
    /<(\/?)div\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi,
  )) {
    depth += tag[1] ? -1 : 1
    if (depth === 0) return fromOpening.slice(0, tag.index + tag[0].length)
  }
  return undefined
}
