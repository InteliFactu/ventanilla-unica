import type { HttpClient } from '../../../http/types/HttpClient'
import { readYouthGuaranteeHistoryCount } from '../parsers/readYouthGuaranteeHistoryCount'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** GET counterpart of the wizard's history table, without posting a form. */
export const fetchYouthGuaranteeHistory = async (
  client: HttpClient,
): Promise<number> => {
  const page = await client.request(youthGuaranteeUrls.history)
  if (page.status !== 200)
    throw new Error('Garantía Juvenil: could not read inscription history')
  return readYouthGuaranteeHistoryCount(page.text)
}
