import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { mapYouthGuaranteeSubmission } from './mappers/mapYouthGuaranteeSubmission'
import { readYouthGuaranteeFields } from './parsers/readYouthGuaranteeFields'
import { readYouthGuaranteeForm } from './parsers/readYouthGuaranteeForm'
import { readYouthGuaranteeReceipt } from './parsers/readYouthGuaranteeReceipt'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeReceipt } from './types/YouthGuaranteeReceipt'
import { validateYouthGuaranteeAnswers } from './validators/validateYouthGuaranteeAnswers'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

/** No retries: even a lost response may follow a saved or submitted request. */
export const submitYouthGuarantee = async (
  client: HttpClient,
  answers: YouthGuaranteeAnswers,
  confirmed: boolean,
): Promise<YouthGuaranteeReceipt> => {
  if (!confirmed)
    throw new Error('Garantía Juvenil: inscription requires --confirmar si')
  let page = validateYouthGuaranteePage(
    await client.request(youthGuaranteeUrls.page(1)),
  )
  for (let step = 1; step <= 6; step += 1) {
    validateYouthGuaranteeAnswers(
      { [String(step)]: answers[String(step)] ?? {} },
      [{ step, title: '', fields: readYouthGuaranteeFields(page.text) }],
    )
    const form = mapYouthGuaranteeSubmission(page.text, page.url, step, answers)
    try {
      page = await postForm(
        client,
        form,
        {},
        {
          referer: page.url,
          headers: { Origin: youthGuaranteeUrls.origin },
          followRedirects: false,
        },
      )
      const location = page.headers['location']
      if (
        (page.status === 302 || page.status === 303) &&
        typeof location === 'string'
      ) {
        const next = new URL(location, page.url)
        if (next.origin !== youthGuaranteeUrls.origin)
          throw new Error('foreign redirect')
        page = await client.request(next.href, { followRedirects: false })
      }
      validateYouthGuaranteePage(page)
      if (step < 6) readYouthGuaranteeForm(page.text, page.url, step + 1)
    } catch {
      throw new Error(
        `Garantía Juvenil: inscription step ${String(step)} was sent but its outcome is unverified. Do not retry automatically; inspect the portal first.`,
      )
    }
  }
  return readYouthGuaranteeReceipt(page.text)
}
