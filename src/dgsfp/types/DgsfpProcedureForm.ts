import type { DgsfpSection } from './DgsfpSection'

/** The procedure's form: its telematic number (TEL43), its title and its sections. */
export type DgsfpProcedureForm = {
  readonly numTelematico: string
  readonly titulo: string
  readonly sections: readonly DgsfpSection[]
}
