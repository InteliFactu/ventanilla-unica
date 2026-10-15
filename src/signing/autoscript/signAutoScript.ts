import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { postTimestampQuery } from '../tsp/fetchers/postTimestampQuery'
import type { TimestampPost } from '../tsp/types/TimestampPost'
import { certificateDerBase64 } from './certificateDerBase64'
import { multisignAutoScript } from './multisignAutoScript'
import { parseAutoScriptAlgorithm } from './parsers/parseAutoScriptAlgorithm'
import { parseExtraParams } from './parsers/parseExtraParams'
import { selectAutoScriptFamily } from './selectors/selectAutoScriptFamily'
import { signAutoscriptData } from './signAutoscriptData'
import { signAutoScriptFamily } from './signAutoScriptFamily'
import type { AutoScriptRequest } from './types/AutoScriptRequest'
import type { AutoScriptResult } from './types/AutoScriptResult'
import { validateKeyType } from './validators/validateKeyType'

/**
 * Do locally what AutoFirma does for a sede page's `AutoScript.sign(data,
 * algorithm, format, extraParams)` (or `coSign`/`counterSign` for CAdES),
 * with AutoFirma's defaults, and return
 * what its success callback receives: the signature and the certificate.
 * The page's own code posts them; nothing here talks to the sede. The one
 * request made is to the TSA a `tsaURL` parameter names, through `post`.
 */
export const signAutoScript = async (
  identity: CertificateIdentity,
  request: AutoScriptRequest,
  post: TimestampPost = postTimestampQuery,
): Promise<AutoScriptResult> => {
  const family = selectAutoScriptFamily(request.format)
  const certificate = certificateDerBase64(identity)
  if (family === 'none')
    return {
      signature: signAutoscriptData(identity, request.data, request.algorithm),
      certificate,
    }
  const algorithm = parseAutoScriptAlgorithm(request.algorithm)
  validateKeyType(identity, algorithm)
  if (request.operation !== undefined && request.operation !== 'sign') {
    const signed = multisignAutoScript(
      identity,
      family,
      request,
      algorithm.digest,
    )
    return { signature: signed.toString('base64'), certificate }
  }
  const data = Buffer.from(request.data, 'base64')
  if (data.length === 0) throw new Error('the portal sent no data to sign')
  const signed = await signAutoScriptFamily(
    identity,
    family,
    {
      data,
      format: request.format,
      params: parseExtraParams(request.extraParams),
      post,
    },
    algorithm.digest,
  )
  return { signature: signed.toString('base64'), certificate }
}
