import type { HttpClient } from '../../../http/types/HttpClient'
import { parseYouthGuaranteeMunicipalities } from '../parsers/parseYouthGuaranteeMunicipalities'
import type { YouthGuaranteeMunicipality } from '../types/YouthGuaranteeMunicipality'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

export const fetchYouthGuaranteeMunicipalities = async (
  client: HttpClient,
  province: string,
): Promise<readonly YouthGuaranteeMunicipality[]> => {
  const response = await client.request(youthGuaranteeUrls.municipalities, {
    method: 'POST',
    body: JSON.stringify({ idProvincia: province }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Origin: youthGuaranteeUrls.origin,
    },
    referer: youthGuaranteeUrls.page(2),
    followRedirects: false,
  })
  if (
    response.status !== 200 ||
    new URL(response.url).origin !== youthGuaranteeUrls.origin
  )
    throw new Error(
      'Garantía Juvenil: municipality lookup failed; no address was submitted',
    )
  return parseYouthGuaranteeMunicipalities(response.text)
}
