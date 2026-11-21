import type { HttpClient } from '../../http/types/HttpClient'
import { fetchDraftPdf } from './fetchers/fetchDraftPdf'
import { importDraftFile } from './fetchers/importDraftFile'
import { openPresentationForm } from './fetchers/openPresentationForm'
import { pressDraftButton } from './fetchers/pressDraftButton'
import { noticesHaveNoError } from './mappers/noticesHaveNoError'
import { parseDraftFileHeader } from './parsers/parseDraftFileHeader'
import { parseDraftFileHolder } from './parsers/parseDraftFileHolder'
import { parseDraftNotices } from './parsers/parseDraftNotices'
import type { SelfAssessmentValidation } from './types/SelfAssessmentValidation'
import { writeDraftPdf } from './writeDraftPdf'

/**
 * Run a 303 file through the AEAT's own presentation form for its holder:
 * census identification, Importar, Validar and, with an out directory, the
 * Vista previa. Guardar and Presentar are never pressed, so nothing is saved
 * or filed; the answer is the AEAT's server-side check of the declaration.
 */
export const dryRunSelfAssessment = async (
  client: HttpClient,
  file: Buffer,
  outDir?: string,
): Promise<SelfAssessmentValidation> => {
  const header = parseDraftFileHeader(file)
  if (header.modelo !== '303')
    throw new Error(`only the 303 is supported, the file is a ${header.modelo}`)
  const holder = parseDraftFileHolder(file)
  const { session, form, validateUuid } = await openPresentationForm(
    client,
    header,
    holder,
  )
  const importNotices = await importDraftFile(session, form.importUuid, file)
  const imported = noticesHaveNoError(importNotices)
  const validationNotices = imported
    ? parseDraftNotices(await pressDraftButton(session, validateUuid))
    : []
  const validated = noticesHaveNoError(validationNotices)
  const notes = [
    'validated in the presentation form; Guardar and Presentar were not pressed, nothing was filed',
  ]
  const result = {
    ...header,
    ...holder,
    imported,
    importNotices,
    validated,
    validationNotices,
    notes,
  }
  if (!validated || outDir === undefined) return result
  const pdf = await fetchDraftPdf(session, form.previewUuid)
  return { ...result, pdfPath: await writeDraftPdf(outDir, header, pdf) }
}
