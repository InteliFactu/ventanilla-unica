/** Unpadded field text by 1-based workbook start position, including tax amounts as integer digit strings. */
export type Model303PageInput = {
  readonly ejercicio: '2025' | '2026'
  readonly tag: '01000' | '02000' | '03000' | '04000' | '05000' | 'DID00'
  readonly values: Readonly<Partial<Record<number, string>>>
}
