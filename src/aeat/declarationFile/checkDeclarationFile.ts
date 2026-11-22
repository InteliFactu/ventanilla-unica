import type { HttpClient } from '../../http/types/HttpClient'
import { postDraftEvent } from '../selfAssessmentDraft/fetchers/postDraftEvent'
import { uploadDraftFile } from '../selfAssessmentDraft/fetchers/uploadDraftFile'
import { parseDraftFileHeader } from '../selfAssessmentDraft/parsers/parseDraftFileHeader'
import { parseDraftNotices } from '../selfAssessmentDraft/parsers/parseDraftNotices'
import { presentationBaseUrl } from '../selfAssessmentDraft/presentationBaseUrl'
import { declarationFilePageUrl } from './mappers/declarationFilePageUrl'
import { declarationFileZkauUrl } from './mappers/declarationFileZkauUrl'
import { parseDeclarationFileForm } from './parsers/parseDeclarationFileForm'
import { parseDeclarationFileHolder } from './parsers/parseDeclarationFileHolder'
import type { DeclarationFileCheck } from './types/DeclarationFileCheck'

/**
 * Read a model file on the AEAT's own "Envío Fichero" page, as its holder or
 * an apoderado: the AEAT parses it and runs the model's checks (format and the
 * arithmetic between casillas) and answers with its errors and avisos table.
 * Firmar y enviar and Formalizar Ingreso / Devolución are never pressed, so
 * nothing is signed or filed. Only the 390 has been verified live.
 */
export const checkDeclarationFile = async (
  client: HttpClient,
  file: Buffer,
): Promise<DeclarationFileCheck> => {
  const header = parseDraftFileHeader(file)
  if (header.modelo !== '390')
    throw new Error(`only the 390 is supported, the file is a ${header.modelo}`)
  const pageUrl = declarationFilePageUrl(header)
  const form = parseDeclarationFileForm((await client.request(pageUrl)).text)
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
  return {
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
}
