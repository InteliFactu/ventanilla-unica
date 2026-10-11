import { buildMultipartBody } from '../../../sta/registry/builders/buildMultipartBody'
import { draftSimulatorBaseUrl } from '../draftSimulatorBaseUrl'
import { draftAppPath } from '../mappers/draftAppPath'
import type { DraftSession } from '../types/DraftSession'

/**
 * Hand the file to the Importar button as the browser's file input does: one
 * multipart `file` part to `zkau/dropupload`. The import itself runs on the
 * `onUpload` event that follows.
 */
export const uploadDraftFile = async (
  session: DraftSession,
  importUuid: string,
  file: Buffer,
): Promise<void> => {
  const { body, contentType } = buildMultipartBody(
    {},
    {
      field: 'file',
      name: 'autoliquidacion.txt',
      type: 'text/plain',
      bytes: file,
    },
  )
  const query = new URLSearchParams({
    uuid: importUuid,
    dtid: session.desktopId,
    sid: '0',
  })
  await session.client.request(
    `${draftSimulatorBaseUrl}${draftAppPath(session.modelo)}/pwda/zkau/dropupload?${query.toString()}`,
    {
      method: 'POST',
      body,
      headers: { 'Content-Type': contentType },
      referer: session.pageUrl,
    },
  )
}
