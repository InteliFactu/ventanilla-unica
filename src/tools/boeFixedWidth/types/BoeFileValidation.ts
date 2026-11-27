/** Structural validation plus field checks where the model year has a layout. */
export type BoeFileValidation = {
  readonly modelo: string
  readonly ejercicio: string
  readonly periodo?: string
  readonly registros: number
  readonly validation: 'structure' | 'layout'
  readonly valid: boolean
  readonly problems: readonly string[]
}
