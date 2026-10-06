import type { AeatPage } from './AeatPage'
import type { FilingParty } from './FilingParty'

/** The registry's step-1 form for one CSV: the procedure it resolved to and who files for whom. */
export type FilingForm = {
  readonly page: AeatPage
  readonly tramite: string
  readonly procedimiento: string
  readonly expediente: string
  readonly interesado: FilingParty
  readonly representante?: FilingParty | undefined
  readonly titular?: FilingParty | undefined
}
