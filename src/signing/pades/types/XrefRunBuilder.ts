import type { XrefOffset } from './XrefOffset'

/** A run of consecutive xref entries still being built. */
export type XrefRunBuilder = { first: number; entries: XrefOffset[] }
