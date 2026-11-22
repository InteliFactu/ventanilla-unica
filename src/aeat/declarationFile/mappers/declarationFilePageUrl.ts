import { presentationBaseUrl } from '../../selfAssessmentDraft/presentationBaseUrl'
import type { DraftFileHeader } from '../../selfAssessmentDraft/types/DraftFileHeader'
import { declarationFileAppPath } from './declarationFileAppPath'

/** The "Envío Fichero" page of one model and exercise, reached with a certificate. */
export const declarationFilePageUrl = (header: DraftFileHeader): string =>
  `${presentationBaseUrl}${declarationFileAppPath(header.modelo)}/E${header.ejercicio}/CONT/index.zul?EDFI`
