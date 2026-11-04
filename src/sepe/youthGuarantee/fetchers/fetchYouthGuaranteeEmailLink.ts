import { redirectTarget } from '../../../http/redirectTarget'
import type { HttpClient } from '../../../http/types/HttpClient'
import { validateYouthGuaranteeEmailLink } from '../validators/validateYouthGuaranteeEmailLink'

export const fetchYouthGuaranteeEmailLink = async (
  client: HttpClient,
  link: string,
): Promise<void> => {
  let current = validateYouthGuaranteeEmailLink(link)
  for (let hop = 0; hop <= 10; hop += 1) {
    let response
    let next: string | undefined
    try {
      response = await client.request(current, { followRedirects: false })
      next = redirectTarget(response, current)
    } catch {
      throw new Error(
        'Garantía Juvenil: email verification request outcome is unverified; inspect the portal before retrying',
      )
    }
    if (next !== undefined) {
      current = validateYouthGuaranteeEmailLink(next)
      continue
    }
    if (response.status !== 200)
      throw new Error(
        'Garantía Juvenil: email verification link failed; inspect the portal before retrying',
      )
    return
  }
  throw new Error('Garantía Juvenil: too many email verification redirects')
}
