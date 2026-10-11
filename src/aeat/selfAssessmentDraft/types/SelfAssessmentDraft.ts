import type { DraftFileHeader } from './DraftFileHeader'
import type { DraftNotice } from './DraftNotice'

/** What the simulator made of a presentation file: its notices and, when it imported, the official draft PDF. */
export type SelfAssessmentDraft = DraftFileHeader & {
  /** True when the import raised no error; avisos do not stop it. */
  readonly imported: boolean
  readonly notices: readonly DraftNotice[]
  /** The official form rendered by the AEAT, watermarked "BORRADOR NO VÁLIDO PARA SU PRESENTACIÓN". */
  readonly pdfPath?: string | undefined
  readonly notes: readonly string[]
}
