import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { answerTestTimestamp } from '../tsp/fixtures/answerTestTimestamp'
import { countersignXadesSignature } from './countersignXadesSignature'
import { hasXmlsec } from './fixtures/hasXmlsec'
import { listSignatureIds } from './fixtures/listSignatureIds'
import { xmlsecVerifies } from './fixtures/xmlsecVerifies'
import { signXml } from './signXml'
import { timestampXadesSignature } from './timestampXadesSignature'

const signer = buildTestIdentity('SIGNER')
const counter = buildTestIdentity('COUNTER')
const document = Buffer.from('<doc><item>synthetic</item></doc>')

describe('countersignXadesSignature', () => {
  it.skipIf(!hasXmlsec)(
    'countersigns the SignatureValue beside a timestamp, every signature valid',
    async () => {
      const stamped = await timestampXadesSignature(
        signXml(signer, document, { mode: 'enveloped' }).xml,
        { url: 'https://tsa.example.test/tsr' },
        answerTestTimestamp,
      )
      const countersigned = countersignXadesSignature(counter, stamped)
      expect(countersigned.toString()).toMatch(
        /<\/xades:SignatureTimeStamp><xades:CounterSignature><ds:Signature [^>]*>/,
      )
      expect(countersigned.toString()).toContain(
        'Type="http://uri.etsi.org/01903#CountersignedSignature"',
      )
      const ids = listSignatureIds(countersigned)
      expect(ids).toHaveLength(2)
      for (const id of ids)
        expect(xmlsecVerifies(countersigned, undefined, id)).toBe('')
    },
  )
})
