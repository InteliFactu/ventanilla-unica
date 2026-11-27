import type { FixedWidthField } from '../types/FixedWidthField'

/** What each field kind may hold; A and X are left aligned, so no leading blank unless all blank. */
export const fixedWidthPatterns: Readonly<
  Record<FixedWidthField['kind'], RegExp>
> = {
  N: /^\d+$/,
  A: /^(?:[A-Z0-9\u{D1}\u{C7}][A-Z0-9\u{D1}\u{C7} ]*| +)$/u,
  X: /^(?:[\x21-\x7E\u{A0}-\u{FF}][\x20-\x7E\u{A0}-\u{FF}]*| +)$/u,
}
