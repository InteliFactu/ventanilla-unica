import type { IriaSurvey } from './IriaSurvey'
import type { IriaUnit } from './IriaUnit'

/** `ine encuestas`: the unit and its assigned surveys, from the page IRIA opens after login. */
export type IriaSurveysResult = {
  readonly unidad: IriaUnit | undefined
  readonly encuestas: readonly IriaSurvey[]
  readonly pagina: string
  readonly notes: readonly string[]
}
