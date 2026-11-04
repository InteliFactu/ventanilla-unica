import { htmlToText } from '../../../html/htmlToText'
import type { HttpClient } from '../../../http/types/HttpClient'
import { readYouthGuaranteeFields } from '../parsers/readYouthGuaranteeFields'
import { readYouthGuaranteeForm } from '../parsers/readYouthGuaranteeForm'
import type { YouthGuaranteePage } from '../types/YouthGuaranteePage'
import { validateYouthGuaranteePage } from '../validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** Navigation GETs only: none of the Token.action save/validate actions run. */
export const fetchYouthGuaranteePages = async (
  client: HttpClient,
): Promise<readonly YouthGuaranteePage[]> => {
  const pages: YouthGuaranteePage[] = []
  for (let step = 1; step <= 6; step += 1) {
    const page = validateYouthGuaranteePage(
      await client.request(youthGuaranteeUrls.page(step)),
    )
    readYouthGuaranteeForm(page.text, page.url, step)
    pages.push({
      step,
      title: htmlToText(
        /<title>([\s\S]*?)<\/title>/i.exec(page.text)?.[1] ?? '',
      ),
      fields: readYouthGuaranteeFields(page.text),
    })
  }
  return pages
}
