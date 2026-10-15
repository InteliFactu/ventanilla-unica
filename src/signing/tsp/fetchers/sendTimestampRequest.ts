import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'

import { lookupPublicAddress } from '../lookupPublicAddress'
import { timestampReplyLimit } from '../timestampReplyLimit'
import type { TimestampHttpReply } from '../types/TimestampHttpReply'

/** POST the query to the TSA through `lookupPublicAddress`, without following redirects, reading at most `timestampReplyLimit` bytes within 30 s in all. */
export const sendTimestampRequest = async (
  url: URL,
  query: Buffer,
): Promise<TimestampHttpReply> =>
  new Promise((resolve, reject) => {
    const send = url.protocol === 'https:' ? httpsRequest : httpRequest
    const outgoing = send(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/timestamp-query',
          'Content-Length': query.length,
        },
        lookup: lookupPublicAddress,
        signal: AbortSignal.timeout(30_000),
      },
      (response) => {
        const chunks: Buffer[] = []
        let received = 0
        response.on('data', (chunk: Buffer) => {
          received += chunk.length
          if (received > timestampReplyLimit)
            response.destroy(new Error('the TSA answer is too large'))
          else chunks.push(chunk)
        })
        response.on('error', reject)
        response.on('end', () => {
          resolve({
            status: response.statusCode ?? 0,
            body: Buffer.concat(chunks),
          })
        })
      },
    )
    outgoing.on('error', reject)
    outgoing.end(query)
  })
