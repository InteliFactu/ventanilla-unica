import type { HttpClient } from '../../http/types/HttpClient'
import type { DgsfpSection } from '../types/DgsfpSection'
import { callDgsfpService } from './callDgsfpService'

/** A reusable section by id (`ObtenerSeccion?ns=`); its definition is a JSON string inside the answer. */
export const fetchReusableSection = async (
  client: HttpClient,
  digest: string,
  id: string,
): Promise<DgsfpSection> => {
  const answer = (await callDgsfpService(
    client,
    digest,
    `GFRestService.svc/ObtenerSeccion?ns=${encodeURIComponent(id)}`,
  )) as { readonly jsonSeccion: string }
  return JSON.parse(answer.jsonSeccion) as DgsfpSection
}
