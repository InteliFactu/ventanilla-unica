import type { HttpClient } from '../../../http/types/HttpClient'
import type { YouthGuaranteeDocument } from '../types/YouthGuaranteeDocument'
import { writeYouthGuaranteePdf } from '../writers/writeYouthGuaranteePdf'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

export const fetchYouthGuaranteeDocuments = async (
  client: HttpClient,
  documents: readonly YouthGuaranteeDocument[],
  out: string,
): Promise<readonly YouthGuaranteeDocument[]> => {
  const saved: YouthGuaranteeDocument[] = []
  for (const [index, document] of documents.entries()) {
    if (new URL(document.url).origin !== youthGuaranteeUrls.origin)
      throw new Error('Garantía Juvenil: foreign document URL')
    const response = await client.request(document.url, {
      followRedirects: false,
    })
    if (response.status !== 200)
      throw new Error(
        'Garantía Juvenil: document download failed; redirects are refused',
      )
    saved.push({
      ...document,
      path: await writeYouthGuaranteePdf(out, index + 1, response.body),
    })
  }
  return saved
}
