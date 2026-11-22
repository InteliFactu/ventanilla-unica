import type { DraftNotice } from './DraftNotice'

/** Whether the imported file passed, and the notices of the step that stopped it, or of Validar. */
export type FormValidation = {
  readonly passed: boolean
  readonly notices: readonly DraftNotice[]
}
