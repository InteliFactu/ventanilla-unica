import type { HttpClient } from '../../http/types/HttpClient'
import { fetchYouthGuaranteeDocuments } from './fetchers/fetchYouthGuaranteeDocuments'
import { fetchYouthGuaranteeHistory } from './fetchers/fetchYouthGuaranteeHistory'
import { fetchYouthGuaranteePages } from './fetchers/fetchYouthGuaranteePages'
import { loginYouthGuarantee } from './loginYouthGuarantee'
import { readYouthGuaranteeDocuments } from './parsers/readYouthGuaranteeDocuments'
import { readYouthGuaranteeStatus } from './parsers/readYouthGuaranteeStatus'
import type { YouthGuaranteeResult } from './types/YouthGuaranteeResult'
import { isResumedYouthGuaranteeDraft } from './validators/isResumedYouthGuaranteeDraft'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

export const readYouthGuarantee = async (
  client: HttpClient,
  out?: string,
): Promise<YouthGuaranteeResult> => {
  const landing = await loginYouthGuarantee(client)
  const page = isResumedYouthGuaranteeDraft(landing.url)
    ? validateYouthGuaranteePage(
        await client.request(youthGuaranteeUrls.page(1)),
      )
    : landing
  const status = readYouthGuaranteeStatus(page.text)
  const history =
    status.inscribed === false
      ? await fetchYouthGuaranteeHistory(client)
      : undefined
  const documents = readYouthGuaranteeDocuments(page.text)
  return {
    ...status,
    ...(history === undefined
      ? {}
      : {
          inscribed: history === 0 ? false : null,
          state: history === 0 ? 'not-inscribed' : 'unknown',
          evidence: [
            ...status.evidence,
            `Inscription history records: ${String(history)}.`,
            ...(history === 0
              ? []
              : [
                  'Historical records require review; the draft alone cannot establish current registration.',
                ]),
          ],
        }),
    documents: out
      ? await fetchYouthGuaranteeDocuments(client, documents, out)
      : documents,
    form:
      status.inscribed === false ? await fetchYouthGuaranteePages(client) : [],
  }
}
