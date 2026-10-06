/** How the synthetic TGVI behaves; every field has a happy default. */
export type FakeTgvi = {
  readonly representedAfterSwitch?: string
  readonly start?: Record<string, string>
  readonly totals?: Record<string, string>
  readonly errors?: string
  readonly shownHeader?: string
  readonly presented?: Record<string, string>
}
