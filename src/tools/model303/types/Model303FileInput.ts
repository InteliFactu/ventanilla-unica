/** Metadata and field-encoded pages to assemble into an AEAT file. */
export type Model303FileInput = {
  readonly ejercicio: '2025' | '2026'
  readonly periodo: string
  readonly pages: readonly string[]
  readonly softwareVersion?: string
  readonly softwareNif?: string
}
