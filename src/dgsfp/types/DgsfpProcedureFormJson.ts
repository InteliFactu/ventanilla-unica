import type { DgsfpSection } from './DgsfpSection'

/** The parsed `jsonFormulario` of the procedure: its sections. */
export type DgsfpProcedureFormJson = {
  readonly secciones: readonly DgsfpSection[]
}
