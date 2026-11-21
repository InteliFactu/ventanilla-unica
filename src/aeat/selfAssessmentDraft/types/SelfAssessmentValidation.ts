import type { DraftFileHeader } from './DraftFileHeader'
import type { DraftFileHolder } from './DraftFileHolder'
import type { DraftNotice } from './DraftNotice'

/** What the AEAT's own presentation form made of a file: imported, validated, never saved or presented. */
export type SelfAssessmentValidation = DraftFileHeader &
  DraftFileHolder & {
    /** True when the import raised no error; avisos do not stop it. */
    readonly imported: boolean
    readonly importNotices: readonly DraftNotice[]
    /** True when Validar raised no error. */
    readonly validated: boolean
    readonly validationNotices: readonly DraftNotice[]
    /** The form's Vista previa, watermarked as a draft. */
    readonly pdfPath?: string | undefined
    readonly notes: readonly string[]
  }
