import { derInteger } from '../../asn1/derInteger'
import { derNode } from '../../asn1/derNode'
import { derOctetString } from '../../asn1/derOctetString'
import { derOid } from '../../asn1/derOid'
import { derSequence } from '../../asn1/derSequence'
import { cmsDigestOids } from '../../cms/cmsDigestOids'
import type { TimestampQuery } from '../types/TimestampQuery'

/**
 * TimeStampReq ::= SEQUENCE { version 1, messageImprint, reqPolicy OPTIONAL,
 * nonce, certReq TRUE } (RFC 3161 section 2.4.1): the TSA certificate is
 * asked for so the token carries it.
 */
export const buildTimeStampReq = (query: TimestampQuery): Buffer =>
  derSequence([
    derInteger(1),
    derSequence([
      derSequence([derOid(cmsDigestOids[query.digest])]),
      derOctetString(query.imprint),
    ]),
    ...(query.policy === undefined ? [] : [derOid(query.policy)]),
    derInteger(query.nonce),
    derNode(0x01, Buffer.from([0xff])),
  ])
