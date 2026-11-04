import type { HtmlForm } from '../../../html/types/HtmlForm'
import { postForm } from '../../../http/postForm'
import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { validateYouthGuaranteePage } from '../validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** Never retry: a missing response may follow a successful write or SMS. */
export const postYouthGuaranteeAction = async (
  client: HttpClient,
  page: HttpResponse,
  form: HtmlForm,
  action: string,
): Promise<HttpResponse> => {
  try {
    let result = await postForm(
      client,
      form,
      {},
      {
        referer: page.url,
        headers: { Origin: youthGuaranteeUrls.origin },
        followRedirects: false,
      },
    )
    const location = result.headers['location']
    if (
      (result.status === 302 || result.status === 303) &&
      typeof location === 'string'
    ) {
      const next = new URL(location, result.url)
      if (next.origin !== youthGuaranteeUrls.origin)
        throw new Error('foreign redirect')
      result = await client.request(next.href, { followRedirects: false })
    }
    return validateYouthGuaranteePage(result)
  } catch {
    throw new Error(
      `Garantía Juvenil: ${action} was sent but its outcome is unverified. Do not retry automatically; inspect the portal first.`,
    )
  }
}
