import { derContext } from '../../asn1/derContext'
import { derInteger } from '../../asn1/derInteger'
import { derNode } from '../../asn1/derNode'
import { derOctetString } from '../../asn1/derOctetString'
import { derOid } from '../../asn1/derOid'
import { derSequence } from '../../asn1/derSequence'
import { derSetOf } from '../../asn1/derSetOf'
import { readDerChildren } from '../../asn1/parsers/readDerChildren'
import { readDerElement } from '../../asn1/parsers/readDerElement'
import { cmsOids } from '../../cms/cmsOids'

/**
 * A TSA reply to `query` for tests: granted (or `status`), echoing its
 * imprint and nonce (unless `tamper` changes the imprint), with an unsigned
 * token; enough for the parsers here, not for a real verifier.
 */
export const buildTestTimestampReply = (
  query: Buffer,
  status = 0,
  tamper = false,
): Buffer => {
  const fields = readDerChildren(query, readDerElement(query, 0))
  const raw = (index: number): Buffer => {
    const field = fields[index]
    if (!field) throw new Error('short TimeStampReq')
    return Buffer.from(query.subarray(field.start, field.end))
  }
  const imprint = raw(1)
  if (tamper) imprint[imprint.length - 1] = (imprint.at(-1) ?? 0) ^ 0xff
  const nonce = fields.find((field, index) => index > 1 && field.tag === 0x02)
  const tstInfo = derSequence([
    derInteger(1),
    derOid('1.2.3.4'),
    imprint,
    derInteger(7),
    derNode(0x18, Buffer.from('20260101000000Z')),
    ...(nonce ? [Buffer.from(query.subarray(nonce.start, nonce.end))] : []),
  ])
  const token = derSequence([
    derOid(cmsOids.signedData),
    derContext(
      0,
      derSequence([
        derInteger(3),
        derSetOf([]),
        derSequence([
          derOid(cmsOids.tstInfo),
          derContext(0, derOctetString(tstInfo)),
        ]),
        derSetOf([]),
      ]),
    ),
  ])
  return derSequence([derSequence([derInteger(status)]), token])
}
