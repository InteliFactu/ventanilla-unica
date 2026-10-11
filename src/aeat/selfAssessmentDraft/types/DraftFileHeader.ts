/** What the opening tag of a presentation file says it is: `<T303020263T0000>` is the 303 of 2026-3T. */
export type DraftFileHeader = {
  readonly modelo: string
  readonly ejercicio: string
  readonly periodo: string
}
