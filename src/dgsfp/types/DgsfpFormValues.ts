import type { DgsfpSectionValues } from './DgsfpSectionValues'

/** The whole filled form (`ValoresFormulario`), serialised as `datosFormulario`. */
export type DgsfpFormValues = {
  readonly tituloFormulario: string
  readonly secciones: readonly DgsfpSectionValues[]
}
