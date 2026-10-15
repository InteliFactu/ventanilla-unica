import { createHash } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { answerTestTimestamp } from '../tsp/fixtures/answerTestTimestamp'
import { canonicalizeSubtree } from '../xml/mappers/canonicalizeSubtree'
import { parseXmlDocument } from '../xml/parsers/parseXmlDocument'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { selectElementByLocalName } from './selectors/selectElementByLocalName'
import { signXml } from './signXml'
import { timestampXadesSignature } from './timestampXadesSignature'
import type { XadesMode } from './types/XadesMode'

const identity = buildTestIdentity()
const document = Buffer.from('<doc><item>synthetic</item></doc>')
const authority = {
  url: 'https://tsa.example.test/tsr',
  digest: 'sha256',
} as const

describe('timestampXadesSignature', () => {
  it.skipIf(!hasXmlsec).each(['enveloped', 'enveloping'] as const)(
    'stamps the C14N of the SignatureValue when %s, leaving the signature valid',
    async (mode: XadesMode) => {
      const { xml } = signXml(identity, document, { mode })
      let query: Buffer = Buffer.alloc(0)
      const timestamped = await timestampXadesSignature(
        xml,
        authority,
        async (url, body) => {
          query = body
          return answerTestTimestamp(url, body)
        },
      )
      const value = selectElementByLocalName(
        parseXmlDocument(xml).root,
        'SignatureValue',
      )
      const imprint = createHash('sha256')
        .update(
          canonicalizeSubtree(value, { withComments: false, exclusive: false }),
        )
        .digest()
      expect(query.includes(imprint)).toBe(true)
      expect(timestamped.toString()).toMatch(
        /<\/xades:SignedProperties><xades:UnsignedProperties><xades:UnsignedSignatureProperties><xades:SignatureTimeStamp><ds:CanonicalizationMethod Algorithm="http:\/\/www.w3.org\/TR\/2001\/REC-xml-c14n-20010315"><\/ds:CanonicalizationMethod><xades:EncapsulatedTimeStamp>/,
      )
      expect(xmlsecVerifies(timestamped)).toBe('')
    },
  )

  it('refuses a signature that already has unsigned properties', async () => {
    const { xml } = signXml(identity, document, { mode: 'enveloped' })
    const once = await timestampXadesSignature(
      xml,
      authority,
      answerTestTimestamp,
    )
    await expect(
      timestampXadesSignature(once, authority, answerTestTimestamp),
    ).rejects.toThrow('already has unsigned properties')
  })
})
