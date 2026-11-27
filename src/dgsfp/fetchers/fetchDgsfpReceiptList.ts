import type { HttpClient } from '../../http/types/HttpClient'
import { parseDgsfpReceiptList } from '../parsers/parseDgsfpReceiptList'
import { dgsfpUrls } from '../session/dgsfpUrls'
import type { DgsfpReceiptEntry } from '../types/DgsfpReceiptEntry'

export const fetchDgsfpReceiptList = async (
  client: HttpClient,
): Promise<readonly DgsfpReceiptEntry[]> => {
  const page = await client.request(dgsfpUrls.receiptsPage)
  if (page.status !== 200 || page.url !== dgsfpUrls.receiptsPage)
    throw new Error(
      `DGSFP: the receipt page is unavailable (HTTP ${String(page.status)})`,
    )

  const response = await client.request(
    `${dgsfpUrls.authServices}/GdServices.svc/getAcusesRecibo`,
    {
      method: 'GET',
      referer: page.url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  if (response.status !== 200)
    throw new Error(
      `DGSFP: the receipt query failed (HTTP ${String(response.status)})`,
    )

  return parseDgsfpReceiptList(response.text)
}
