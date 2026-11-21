import type { DraftForm } from './DraftForm'
import type { DraftSession } from './DraftSession'

/** An open presentation form: its ZK session, its toolbar and its Validar button. */
export type PresentationForm = {
  readonly session: DraftSession
  readonly form: DraftForm
  readonly validateUuid: string
}
