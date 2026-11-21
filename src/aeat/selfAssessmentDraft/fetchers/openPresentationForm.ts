import type { HttpClient } from '../../../http/types/HttpClient'
import { presentationFormUrl } from '../mappers/presentationFormUrl'
import { parseDraftForm } from '../parsers/parseDraftForm'
import { parseZkButtonUuid } from '../parsers/parseZkButtonUuid'
import { presentationBaseUrl } from '../presentationBaseUrl'
import type { DraftFileHeader } from '../types/DraftFileHeader'
import type { DraftFileHolder } from '../types/DraftFileHolder'
import type { PresentationForm } from '../types/PresentationForm'
import { identifyCensusHolder } from './identifyCensusHolder'

/** Identify the holder in the census window and open the presentation form that follows it. */
export const openPresentationForm = async (
  client: HttpClient,
  header: DraftFileHeader,
  holder: DraftFileHolder,
): Promise<PresentationForm> => {
  await identifyCensusHolder(client, header, holder)
  const pageUrl = presentationFormUrl(header, holder)
  const html = (await client.request(pageUrl)).text
  const form = parseDraftForm(html)
  const validateUuid = parseZkButtonUuid(html, 'cmd__validar')
  if (!validateUuid)
    throw new Error('AEAT: the presentation form has no Validar button')
  const session = {
    client,
    baseUrl: presentationBaseUrl,
    modelo: header.modelo,
    desktopId: form.desktopId,
    pageUrl,
    sid: 0,
  }
  return { session, form, validateUuid }
}
