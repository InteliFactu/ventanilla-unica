import type { HttpClient } from '../../../http/types/HttpClient'
import { postDraftEvent } from '../../selfAssessmentDraft/fetchers/postDraftEvent'
import { uploadDraftFile } from '../../selfAssessmentDraft/fetchers/uploadDraftFile'
import { parseDraftFileHeader } from '../../selfAssessmentDraft/parsers/parseDraftFileHeader'
import { parseDraftNotices } from '../../selfAssessmentDraft/parsers/parseDraftNotices'
import { presentationBaseUrl } from '../../selfAssessmentDraft/presentationBaseUrl'
import { declarationFilePageUrl } from '../mappers/declarationFilePageUrl'
import { declarationFileZkauUrl } from '../mappers/declarationFileZkauUrl'
import { parseDeclarationFileForm } from '../parsers/parseDeclarationFileForm'
import { parseDeclarationFileHolder } from '../parsers/parseDeclarationFileHolder'
import type { DeclarationFileRead } from '../types/DeclarationFileRead'

/**
 * Open a model's "Envío Fichero" page and press Leer declaración with the
 * file: the AEAT parses it, runs the model's checks (format and the arithmetic
 * between casillas) and answers with its errors and avisos table. Nothing is
 * signed or filed; the session stays open for the signature dialog.
 */
export const readDeclarationFile = async (
  client: HttpClient,
  file: Buffer,
): Promise<DeclarationFileRead> => {
  const header = parseDraftFileHeader(file)
  if (header.modelo !== '390')
    throw new Error(`only the 390 is supported, the file is a ${header.modelo}`)
  const pageUrl = declarationFilePageUrl(header)
  const html = (await client.request(pageUrl)).text
  const form = parseDeclarationFileForm(html)
  const session = {
    client,
    baseUrl: presentationBaseUrl,
    zkauUrl: declarationFileZkauUrl(header.modelo),
    desktopId: form.desktopId,
    pageUrl,
    sid: 0,
  }
  await uploadDraftFile(session, form.readUuid, file)
  const answer = await postDraftEvent(session, {
    cmd: 'onUpload',
    uuid: form.readUuid,
    data: { sid: 0 },
  })
  const holder = parseDeclarationFileHolder(answer)
  const notices = parseDraftNotices(answer)
  const check = {
    ...header,
    holder,
    notices,
    // A clean read lists no notices at all, unlike the forms' Validar, which always answers with one.
    valid:
      holder !== undefined && !notices.some(({ kind }) => kind === 'error'),
    notes: [
      'read on the Envío Fichero page; Firmar y enviar was not pressed, nothing was signed or filed',
    ],
  }
  return { check, session, html }
}
