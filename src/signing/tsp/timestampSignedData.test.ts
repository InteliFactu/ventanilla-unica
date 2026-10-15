import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { buildCadesSignedData } from '../cms/buildCadesSignedData'
import { cmsOids } from '../cms/cmsOids'
import { selectSignatureValue } from '../cms/selectors/selectSignatureValue'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { verifyDetachedCms } from '../pades/fixtures/verifyDetachedCms'
import { answerTestTimestamp } from './fixtures/answerTestTimestamp'
import { buildTestTimestampReply } from './fixtures/buildTestTimestampReply'
import { timestampSignedData } from './timestampSignedData'

const identity = buildTestIdentity()
const content = Buffer.from('synthetic content')
const cms = buildCadesSignedData(identity, content, { mode: 'explicit' })
const url = 'https://tsa.example.test/tsr'

describe('timestampSignedData', () => {
  it('adds the TSA token as an unsigned attribute, leaving the signature valid', async () => {
    let asked: Buffer = Buffer.alloc(0)
    const stamped = await timestampSignedData(
      cms,
      { url },
      async (_url, query) => {
        asked = query
        return answerTestTimestamp(_url, query)
      },
    )
    expect(stamped.includes(derOid(cmsOids.signatureTimeStampToken))).toBe(true)
    expect(selectSignatureValue(stamped)).toEqual(selectSignatureValue(cms))
    expect(verifyDetachedCms(stamped, content, identity.cert)).toBe(true)
    expect(asked.includes(derOid(cmsOids.sha512))).toBe(true)
  })

  it.each([
    [
      'a rejection',
      (query: Buffer) => buildTestTimestampReply(query, 2),
      'refused',
    ],
    [
      'another imprint',
      (query: Buffer) => buildTestTimestampReply(query, 0, true),
      'another imprint',
    ],
  ])('refuses %s', async (_name, reply, message) => {
    await expect(
      timestampSignedData(
        cms,
        { url, digest: 'sha256' },
        async (_url, query) => {
          await Promise.resolve()
          return reply(query)
        },
      ),
    ).rejects.toThrow(message)
  })
})
