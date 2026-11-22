import type { DraftFileHeader } from '../../selfAssessmentDraft/types/DraftFileHeader'
import type { DraftFileHolder } from '../../selfAssessmentDraft/types/DraftFileHolder'
import type { DraftNotice } from '../../selfAssessmentDraft/types/DraftNotice'

/** What the AEAT's "Envío Fichero" page made of a file it read: never signed, never presented. */
export type DeclarationFileCheck = DraftFileHeader & {
  /** The holder as the AEAT read it off the file, absent when the file could not be read. */
  readonly holder?: DraftFileHolder | undefined
  /** The errors and avisos table; empty when the file passed every check. */
  readonly notices: readonly DraftNotice[]
  /** True when the file was read and raised no error; avisos do not stop it. */
  readonly valid: boolean
  readonly notes: readonly string[]
}
