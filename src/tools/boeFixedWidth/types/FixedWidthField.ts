/**
 * One field of a BOE fixed-width design: `A` is alphanumeric (upper case,
 * left aligned), `N` is digits only (right aligned), and `X` is verbatim
 * printable ISO-8859-1 text for fields such as an email address.
 */
export type FixedWidthField = {
  readonly name: string
  /** 1-based, as the BOE designs print positions. */
  readonly start: number
  readonly length: number
  readonly kind: 'A' | 'N' | 'X'
  /** Fixed value that always occupies the entire field. */
  readonly literal?: string
  /** Exact permitted representations, including any required padding. */
  readonly allowed?: readonly string[]
}
