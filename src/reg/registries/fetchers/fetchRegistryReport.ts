import type { HttpClient } from '../../../http/types/HttpClient'
import { callRegApi } from '../../session/fetchers/callRegApi'
import type { RegistryDetail } from '../types/RegistryDetail'
import type { RegistryReport } from '../types/RegistryReport'
import type { RegistryTrace } from '../types/RegistryTrace'
import { saveRegistryDocuments } from '../writers/saveRegistryDocuments'

/**
 * One entry by `uuid` in an open session: data, documents and, once it has a
 * number, the SIR exchange trace. With `outDir` every document is downloaded,
 * the signed justificante included.
 */
export const fetchRegistryReport = async (
  client: HttpClient,
  token: string,
  uuid: string,
  outDir: string | undefined,
): Promise<RegistryReport> => {
  const detail = (await callRegApi(
    client,
    token,
    `registry/${encodeURIComponent(uuid)}`,
  )) as RegistryDetail
  const number = detail.registryData.registryNumber
  const trace = number
    ? ((await callRegApi(
        client,
        token,
        `trace/${encodeURIComponent(number)}/1/false`,
      )) as RegistryTrace)
    : { annotations: [] }
  return {
    registry: detail.registryData,
    documents: detail.document,
    trace: trace.annotations,
    saved:
      outDir === undefined
        ? []
        : await saveRegistryDocuments(client, token, detail.document, outDir),
  }
}
