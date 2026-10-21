import { createHash } from 'node:crypto'
import type { HttpClient } from '../../../http/types/HttpClient'
import { writeCarpetaEvidence } from '../writers/writeCarpetaEvidence'

/** Archive the live draft PDF before any signature is posted. */
export const fetchDraftPreview = async (
  client: HttpClient,
  draft: string,
  outDir: string,
): Promise<string> => {
  if (!/^\d{22}$/.test(draft))
    throw new Error('Junta: invalid draft identifier')
  const response = await client.request(
    `https://sede.gobex.es/SEDE/VisorPdf/${draft}.pdf`,
  )
  if (!response.body.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error('Junta: the draft preview was not a PDF')
  await writeCarpetaEvidence(outDir, `${draft}-draft.pdf`, response.body)
  return createHash('sha256').update(response.body).digest('hex')
}
