import type { DraftSession } from '../../selfAssessmentDraft/types/DraftSession'
import type { DeclarationFileCheck } from './DeclarationFileCheck'

/** A file read on the "Envío Fichero" page, with the page and the open session that can go on to sign it. */
export type DeclarationFileRead = {
  readonly check: DeclarationFileCheck
  readonly session: DraftSession
  /** The page as first served, which declares its toolbar buttons. */
  readonly html: string
}
