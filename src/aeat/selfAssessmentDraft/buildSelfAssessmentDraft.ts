import type { HttpClient } from '../../http/types/HttpClient'
import { fetchDraftPdf } from './fetchers/fetchDraftPdf'
import { postDraftEvent } from './fetchers/postDraftEvent'
import { uploadDraftFile } from './fetchers/uploadDraftFile'
import { draftFormUrl } from './mappers/draftFormUrl'
import { parseDraftFileHeader } from './parsers/parseDraftFileHeader'
import { parseDraftForm } from './parsers/parseDraftForm'
import { parseDraftNotices } from './parsers/parseDraftNotices'
import type { DraftSession } from './types/DraftSession'
import type { SelfAssessmentDraft } from './types/SelfAssessmentDraft'
import { writeDraftPdf } from './writeDraftPdf'

/**
 * Import a presentation file into the AEAT's open simulator of its model and
 * exercise, read the import's errors and avisos and, when it imported, save
 * the Vista previa: the official form filled in, watermarked as a draft. The
 * simulator has no login and no Presentar, so nothing is ever filed.
 */
export const buildSelfAssessmentDraft = async (
  client: HttpClient,
  file: Buffer,
  outDir?: string,
): Promise<SelfAssessmentDraft> => {
  const header = parseDraftFileHeader(file)
  const pageUrl = draftFormUrl(header.modelo, header.ejercicio)
  const form = parseDraftForm((await client.request(pageUrl)).text)
  const session: DraftSession = {
    client,
    modelo: header.modelo,
    desktopId: form.desktopId,
    pageUrl,
    sid: 0,
  }
  await uploadDraftFile(session, form.importUuid, file)
  const answer = await postDraftEvent(session, {
    cmd: 'onUpload',
    uuid: form.importUuid,
    data: { sid: 0 },
  })
  const notices = parseDraftNotices(answer)
  const imported =
    notices.length > 0 && !notices.some((notice) => notice.kind === 'error')
  const notes = [
    'the open simulator cannot present: Vista previa is a draft, not a filing',
  ]
  if (!imported || outDir === undefined)
    return { ...header, imported, notices, notes }
  const pdfPath = await writeDraftPdf(
    outDir,
    header,
    await fetchDraftPdf(session, form.previewUuid),
  )
  return { ...header, imported, notices, pdfPath, notes }
}
