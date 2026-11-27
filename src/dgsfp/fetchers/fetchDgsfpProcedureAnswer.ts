import type { HttpClient } from '../../http/types/HttpClient'
import { dgsfpUrls } from '../session/dgsfpUrls'
import type { DgsfpProcedureAnswer } from '../types/DgsfpProcedureAnswer'
import { callDgsfpService } from './callDgsfpService'
import { fetchDgsfpDirectRead } from './fetchDgsfpDirectRead'

/** Read the complaint procedure's form metadata from the authenticated sede. */
export const fetchDgsfpProcedureAnswer = async (
  client: HttpClient,
  digest: string,
  directOnly = false,
): Promise<DgsfpProcedureAnswer> => {
  const path = `RestService.svc/obtenerFormularioProcedimiento?pr=${String(dgsfpUrls.procedureId)}`
  if (!directOnly) {
    return (await callDgsfpService(
      client,
      digest,
      path,
    )) as DgsfpProcedureAnswer
  }
  const body = await fetchDgsfpDirectRead(client, digest, path)
  try {
    return JSON.parse(body) as DgsfpProcedureAnswer
  } catch {
    throw new Error('DGSFP: unexpected complaint procedure metadata')
  }
}
