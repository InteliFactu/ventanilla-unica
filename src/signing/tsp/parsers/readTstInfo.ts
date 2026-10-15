import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import type { TstInfoParts } from '../types/TstInfoParts'

/**
 * Walk a TimeStampToken (ContentInfo, SignedData, encapContentInfo, [0],
 * OCTET STRING) to its TSTInfo and read the imprint and the nonce (the
 * INTEGER after genTime, past the optional accuracy and ordering).
 */
export const readTstInfo = (token: Buffer): TstInfoParts => {
  const [, wrapper] = readDerChildren(token, readDerElement(token, 0))
  const signedData = wrapper && readDerChildren(token, wrapper)[0]
  const encapsulated = signedData && readDerChildren(token, signedData)[2]
  const [, explicit] = encapsulated ? readDerChildren(token, encapsulated) : []
  const octets = explicit && readDerChildren(token, explicit)[0]
  if (!octets) throw new Error('the timestamp token carries no TSTInfo')
  const info = readDerElement(token, octets.valueStart)
  const fields = readDerChildren(token, info)
  const imprint = fields[2] && readDerChildren(token, fields[2])[1]
  const nonce = fields.slice(5).find((field) => field.tag === 0x02)
  if (!imprint) throw new Error('the TSTInfo has no message imprint')
  const value = (start: number, end: number): Buffer =>
    Buffer.from(token.subarray(start, end))
  const raw = nonce ? value(nonce.valueStart, nonce.end) : Buffer.alloc(0)
  return {
    imprint: value(imprint.valueStart, imprint.end),
    nonce: raw.subarray(raw.findIndex((byte) => byte !== 0)),
  }
}
