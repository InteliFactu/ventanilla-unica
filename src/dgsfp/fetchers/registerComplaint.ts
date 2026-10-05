import type { HttpClient } from '../../http/types/HttpClient'
import type { DgsfpRegisterAnswer } from '../types/DgsfpRegisterAnswer'
import type { DgsfpRegisterRequest } from '../types/DgsfpRegisterRequest'
import { callDgsfpService } from './callDgsfpService'

/**
 * The legal act: `registrarPresentacionTelematica` with the signed request
 * document. The page treats an empty answer as a failure, so does this.
 */
export const registerComplaint = async (
  client: HttpClient,
  digest: string,
  request: DgsfpRegisterRequest,
): Promise<DgsfpRegisterAnswer> => {
  const answer = (await callDgsfpService(
    client,
    digest,
    'RestService.svc/registrarPresentacionTelematica',
    request,
  )) as DgsfpRegisterAnswer | null
  if (!answer?.numRegistro)
    throw new Error(
      'DGSFP: the sede answered the filing without a registry number',
    )
  return answer
}
