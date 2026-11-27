/** One-based workbook positions, with optional exact representations. */
export type Model303Field = readonly [
  start: number,
  width: number,
  kind: 'A' | 'An' | 'Num' | 'N' | 'blank',
  allowed?: readonly string[] | undefined,
]
