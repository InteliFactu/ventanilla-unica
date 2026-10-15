/** A stamp rectangle `llx,lly,urx,ury` in points, upper right above and right of lower left. */
export const parsePdfRect = (
  value: string | undefined,
): number[] | undefined => {
  if (value === undefined || value.trim() === '') return undefined
  const numbers = value.split(',').map((part) => Number(part.trim()))
  const [llx = 0, lly = 0, urx = 0, ury = 0] = numbers
  // Written as negations so that a NaN corner fails too.
  if (numbers.length !== 4 || !(urx > llx) || !(ury > lly))
    throw new Error(
      `a rectangle is llx,lly,urx,ury with urx > llx and ury > lly: ${value}`,
    )
  return numbers
}
