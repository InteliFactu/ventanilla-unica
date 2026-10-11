import { draftSimulatorBaseUrl } from '../draftSimulatorBaseUrl'
import { parseDraftPdfPath } from '../parsers/parseDraftPdfPath'
import type { DraftSession } from '../types/DraftSession'
import { postDraftEvent } from './postDraftEvent'

/** Press Vista previa and download the PDF the answer points at. */
export const fetchDraftPdf = async (
  session: DraftSession,
  previewUuid: string,
): Promise<Buffer> => {
  const answer = await postDraftEvent(session, {
    cmd: 'onClick',
    uuid: previewUuid,
    data: { pageX: 1, pageY: 1, which: 1, x: 1, y: 1 },
  })
  const path = parseDraftPdfPath(answer)
  if (path === undefined)
    throw new Error('AEAT: Vista previa answered without a PDF')
  const response = await session.client.request(
    `${draftSimulatorBaseUrl}${path}`,
    {
      referer: session.pageUrl,
    },
  )
  if (!response.body.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error('AEAT: the Vista previa document is not a PDF')
  return response.body
}
