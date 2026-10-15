import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { TimestampQuery } from '../types/TimestampQuery'
import { readTstInfo } from './readTstInfo'

/**
 * The TimeStampToken of a TimeStampResp (RFC 3161 section 2.4.2), refusing a
 * rejection and a token whose TSTInfo does not carry the query's imprint and
 * nonce. shortcut: the TSA's signature and certificate are not validated
 * here; a verifier does that, and AutoFirma does not either.
 */
export const readTimestampToken = (
  response: Buffer,
  query: TimestampQuery,
): Buffer => {
  const [status, token] = readDerChildren(response, readDerElement(response, 0))
  const [code] = status ? readDerChildren(response, status) : []
  const granted = code ? response[code.valueStart] : undefined
  if (code?.tag !== 0x02 || (granted !== 0 && granted !== 1))
    throw new Error(`the TSA refused the timestamp (status ${String(granted)})`)
  if (!token) throw new Error('the TSA answered without a token')
  const der = Buffer.from(response.subarray(token.start, token.end))
  const info = readTstInfo(der)
  if (!info.imprint.equals(query.imprint))
    throw new Error('the timestamp token stamps another imprint')
  if (!info.nonce.equals(query.nonce))
    throw new Error('the timestamp token does not echo the nonce')
  return der
}
