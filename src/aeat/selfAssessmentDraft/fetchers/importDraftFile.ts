import { parseDraftNotices } from '../parsers/parseDraftNotices'
import type { DraftNotice } from '../types/DraftNotice'
import type { DraftSession } from '../types/DraftSession'
import { postDraftEvent } from './postDraftEvent'
import { uploadDraftFile } from './uploadDraftFile'

/** Upload the file to Importar, fire the import and read the notices it raised. */
export const importDraftFile = async (
  session: DraftSession,
  importUuid: string,
  file: Buffer,
): Promise<readonly DraftNotice[]> => {
  await uploadDraftFile(session, importUuid, file)
  const answer = await postDraftEvent(session, {
    cmd: 'onUpload',
    uuid: importUuid,
    data: { sid: 0 },
  })
  return parseDraftNotices(answer)
}
