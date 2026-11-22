import type { DraftForm } from './DraftForm'
import type { DraftSession } from './DraftSession'

/** An open presentation form: its ZK session, its page, its toolbar and its Validar button. */
export type PresentationForm = {
  readonly session: DraftSession
  /** The page as served, to resolve widgets that live outside the toolbar. */
  readonly html: string
  readonly form: DraftForm
  readonly validateUuid: string
}
